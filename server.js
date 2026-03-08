import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Papa from 'papaparse';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());

// Determine if we should use Supabase based on environment configuration
const USE_SUPABASE = process.env.DATA_SOURCE === 'supabase';

// Supabase client initialization (Deferred until needed and valid)
const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';
const supabase = USE_SUPABASE && supabaseUrl.startsWith('http') && supabaseKey 
  ? createClient(supabaseUrl, supabaseKey) 
  : null;

// Data Layer Strategy
const fetchSalesData = async () => {
  if (USE_SUPABASE && supabase) {
    console.log("📡 Fetching data from Supabase DB...");
    const { data, error } = await supabase.from('sales_data').select('*');
    if (error) {
      console.error("Supabase Error:", error);
      throw error;
    }
    return data;
  } else {
    console.log("📄 Fetching data from local CSV fallback...");
    const filePath = path.join(__dirname, 'public', 'data', 'sales_data.csv');
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    // Parse the CSV content to JSON
    const parsedData = Papa.parse(fileContent, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true
    });
    
    // Return only valid rows with dates
    return parsedData.data.filter(row => row.date);
  }
};

// Create API to read and return JSON data
app.get('/api/sales', async (req, res) => {
  try {
    const rows = await fetchSalesData();
    res.json(rows);
  } catch (error) {
    console.error('Error reading sales data:', error);
    res.status(500).json({ error: 'Failed to process sales data' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend API Server running at http://localhost:${PORT}`);
  console.log(`Data Source Mode: ${USE_SUPABASE ? 'SUPABASE' : 'CSV (Fallback)'}`);
});
