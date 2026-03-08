import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { createClient } from '@supabase/supabase-js';

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
    const filePath = path.join(process.cwd(), 'public', 'data', 'sales_data.csv');
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

export async function GET() {
  try {
    const rows = await fetchSalesData();
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error reading sales data:', error);
    return NextResponse.json({ error: 'Failed to process sales data' }, { status: 500 });
  }
}
