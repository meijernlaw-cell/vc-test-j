import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.VITE_GEMINI_API_KEY;
if (!apiKey) {
  console.error("No API key found in .env");
  process.exit(1);
}

// Ensure fetch is available in Node > 18
async function run() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.models) {
      const generateModels = data.models.filter(m => m.supportedGenerationMethods.includes("generateContent"));
      console.log("AVAILABLE MODELS FOR GENERATE CONTENT:");
      generateModels.forEach(m => console.log(m.name.replace('models/', '')));
    } else {
      console.log(data);
    }
  } catch (e) {
    console.error(e);
  }
}

run();
