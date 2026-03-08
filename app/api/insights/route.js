import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function POST(request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key not configured on server.' }, { status: 500 });
    }

    const { stats, aiModel } = await request.json();

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: aiModel || 'gemini-2.5-flash' });

    const prompt = `
      As a senior business analyst, analyze these e-commerce metrics for jenny's dashboard:
      
      TOTALS:
      - Revenue: ${stats.totalRevenue}
      - Profit: ${stats.totalProfit}
      - Orders: ${stats.totalOrders}
      - AOV: ${stats.aov}
      
      PERFORMANCE:
      - Best Product: ${stats.bestProduct}
      - Best Channel: ${stats.bestChannel}
      - Peak Day: ${stats.peakDay}
      - Highest CVR Channel: ${stats.bestCVRChannel} (${stats.bestCVR}%)
      
      Please provide business insights in JSON format with exactly these three keys:
      "alerts": [list of 3 short alerts about immediate concerns or spikes]
      "opportunities": [list of 3 short potential growth areas]
      "suggestions": [list of 3 short tactical actions to take]
      
      KEEP ALL POINTS SHORT AND CLEAR (max 10 words each). Only return the raw JSON object.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanJson = text.replace(/```json|```/gi, '').trim();
    const insights = JSON.parse(cleanJson);

    return NextResponse.json(insights);
  } catch (error) {
    console.error('AI Insights Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate insights' }, { status: 500 });
  }
}
