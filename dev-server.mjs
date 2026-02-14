import { createServer } from 'http';
import { GoogleGenAI } from '@google/genai';
import { config } from 'dotenv';

config(); // Load GEMINI_API_KEY from .env

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    console.error('❌ GEMINI_API_KEY is missing in .env');
    process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

const server = createServer(async (req, res) => {
    // Enable CORS for development
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.url === '/api/ai' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { type, payload } = JSON.parse(body);

                const prompt = type === 'recipe'
                    ? `You are an expert nutritionist for the app "Diet Deck". The user has selected "${payload.foodName}" as their protein source for a meal. Their daily protein target is ${payload.proteinTarget}g. Provide a healthy, delicious recipe focusing on "${payload.foodName}". The response must be in JSON format with the following structure: { "recipeName": "string", "ingredients": ["string"], "instructions": ["string"], "nutritionalValue": "Brief summary of P/C/F for this dish" } Only return the JSON.`
                    : `You are an expert nutritionist for the app "Diet Deck". The user's current weekly plan is: ${payload.currentPlan}. They are short of their daily protein goal by ${payload.proteinGap}g. Suggest 2-3 quick snacks or meal adjustments to bridge this gap. Keep it brief and encouraging. Only return the text.`;

                const response = await ai.models.generateContent({
                    model: 'gemini-3-flash-preview',
                    contents: prompt
                });

                res.writeHead(200, { 'Content-Type': 'application/json' });
                if (type === 'recipe') {
                    const text = response.text || '';
                    const cleanJson = text.replace(/```json|```/g, '').trim();
                    res.end(cleanJson);
                } else {
                    res.end(JSON.stringify({ text: response.text || '' }));
                }
            } catch (error) {
                console.error('Error:', error);
                res.writeHead(500);
                res.end(JSON.stringify({ error: 'AI Error' }));
            }
        });
    } else {
        res.writeHead(404);
        res.end();
    }
});

const PORT = 3200;
server.listen(PORT, () => {
    console.log(`🚀 AI Local Proxy running on http://localhost:${PORT}`);
    console.log(`   Routing /api/ai to Gemini-3-Flash-Preview`);
});
