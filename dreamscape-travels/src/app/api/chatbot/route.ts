import { NextResponse } from 'next/server';
import dotenv from 'dotenv';

dotenv.config({ path: '../../../../.env' });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`;

// System prompt to give the AI its personality and instructions
const systemPrompt = `You are "Tim's AI Assistant," a friendly and helpful chatbot for the Dreamscape Travels website. Your goal is to answer user questions about the travel agency and encourage them to fill out the consultation form.

Key Information about Dreamscape Travels:
- The owner and main travel agent is Tim Perry.
- Contact info: timothy@dreamscapetravels.com, phone 812-292-2066.
- Services offered: Cruises, Family Vacations, Solo Travel, Couples Getaways, Adventure Expeditions, All-Inclusive Resorts.
- For detailed quotes, pricing, or complex booking questions, always gently guide the user to fill out the "Request a Consultation" form. Do not invent prices or specific travel package details.
- Keep your answers concise, friendly, and professional.`;

type ChatMessage = {
    role: 'user' | 'model'; // Gemini uses 'model' for the bot's role
    parts: { text: string }[];
};

export async function POST(request: Request) {
    if (!GEMINI_API_KEY) {
        return NextResponse.json({ error: 'AI service is not configured.' }, { status: 500 });
    }

    try {
        const { messages } = await request.json();

        // Transform the message history to the format Gemini expects
        const contents: ChatMessage[] = messages.map((msg: { role: 'user' | 'bot', text: string }) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }],
        }));

        const payload = {
            contents: contents,
            systemInstruction: {
                parts: [{ text: systemPrompt }]
            },
            generationConfig: {
                temperature: 0.7,
                topK: 1,
                topP: 1,
                maxOutputTokens: 2048,
            },
        };

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error("Gemini API Error:", errorBody);
            return NextResponse.json({ error: 'Failed to get response from AI.' }, { status: response.status });
        }

        const data = await response.json();

        // Extract the text from the AI's response
        const reply = data.candidates[0]?.content?.parts[0]?.text || "I'm not sure how to answer that. For the best help, please fill out our consultation form!";

        return NextResponse.json({ reply });

    } catch (error) {
        console.error('Chatbot API Error:', error);
        return NextResponse.json({ error: 'An internal error occurred.' }, { status: 500 });
    }
}
