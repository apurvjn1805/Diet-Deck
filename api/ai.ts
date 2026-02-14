import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { type, payload } = req.body;
    const apiKey = process.env['GEMINI_API_KEY'];

    if (!apiKey) {
        return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
    }

    const ai = new GoogleGenAI({ apiKey });

    try {
        const prompt = type === 'recipe'
            ? `You are an expert nutritionist for the app "Diet Deck". The user has selected "${payload.foodName}" as their protein source for a meal. Their daily protein target is ${payload.proteinTarget}g. Provide a healthy, delicious recipe focusing on "${payload.foodName}". The response must be in JSON format with the following structure: { "recipeName": "string", "ingredients": ["string"], "instructions": ["string"], "nutritionalValue": "Brief summary of P/C/F for this dish" } Only return the JSON.`
            : `You are an expert nutritionist for the app "Diet Deck". The user's current weekly plan is: ${payload.currentPlan}. They are short of their daily protein goal by ${payload.proteinGap}g. Suggest 2-3 quick snacks or meal adjustments to bridge this gap. Keep it brief and encouraging. Only return the text.`;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt
        });

        if (type === 'recipe') {
            const text = response.text || '';
            const cleanJson = text.replace(/```json|```/g, '').trim();
            return res.status(200).json(JSON.parse(cleanJson));
        } else {
            return res.status(200).json({ text: response.text || '' });
        }
    } catch (error: any) {
        console.error('Gemini API Error:', error);
        return res.status(500).json({ error: 'Failed to communicate with AI' });
    }
}
