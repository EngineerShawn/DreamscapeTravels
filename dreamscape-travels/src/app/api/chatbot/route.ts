/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, SchemaType, Schema } from "@google/generative-ai";
import ConsultationEmail from '@/components/ConsultationEmail';
import { Resend } from 'resend';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '../../../../.env' });

// --- INITIALIZE SERVICES ---
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is not defined.');
if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY is not defined.');

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const resend = new Resend(RESEND_API_KEY);

// --- DEFINE AI TOOLS (FUNCTION CALLING) ---
const tools = [
    {
        functionDeclarations: [
            {
                name: "submitConsultationRequest",
                description: "Submits the user's travel consultation request. Only call this function when all required information has been collected from the user.",
                parameters: {
                    type: SchemaType.OBJECT,
                    properties: {
                        fullName: { type: SchemaType.STRING, description: "The user's full name." } as Schema,
                        email: { type: SchemaType.STRING, description: "The user's email address." } as Schema,
                        destination: { type: SchemaType.STRING, description: "The user's desired travel destination(s), as a comma-separated string." } as Schema,
                        phone: { type: SchemaType.STRING, description: "The user's phone number. (Optional)" } as Schema,
                        startDate: { type: SchemaType.STRING, description: "The user's approximate start date for the trip. (Optional)" } as Schema,
                        endDate: { type: SchemaType.STRING, description: "The user's approximate end date for the trip. (Optional)" } as Schema,
                        adults: { type: SchemaType.STRING, description: "The number of adults traveling. (Optional, defaults to 1)" } as Schema,
                        children: { type: SchemaType.STRING, description: "The number of children traveling. (Optional, defaults to 0)" } as Schema,
                        budget: { type: SchemaType.STRING, description: "The user's estimated budget per person. (Optional)" } as Schema,
                        comments: { type: SchemaType.STRING, description: "Any additional comments or requests from the user. (Optional)" } as Schema,
                    },
                    required: ["fullName", "email", "destination"],
                },
            },
        ],
    }
];

// --- DEFINE SYSTEM INSTRUCTION ---
const systemInstruction = {
    role: "system",
    parts: [{
        text: `You are "Tim's AI Assistant," a friendly and helpful chatbot for the Dreamscape Travels website. Your primary goal is to answer user questions about the travel agency.
      
    Key Information about Dreamscape Travels:
    - The owner and main travel agent is Tim Perry.
    - Contact info: timothy@dreamscapetravels.com, phone 812-292-2066.
    - Services offered: Cruises, Family Vacations, Solo Travel, Couples Getaways, Adventure Expeditions, All-Inclusive Resorts.
    - For detailed quotes, pricing, or complex booking questions, always gently guide the user to fill out the "Request a Consultation" form. Do not invent prices or specific travel package details.
    - DO NOT provide ANY information about ANYTHING that is not related to Dreamscape Travels or its services.
    - If the user asks anything outside of Dreamscape Travels or its services, politely inform them that you can only assist with inquiries related to Dreamscape Travels.
    - If the user asks who created you, say "I was created and developed by EngineerShawn, a Full-Stack Software Engineer and AI Engineer."
    - Keep your answers concise, friendly, and professional.


  If a user expresses interest in getting a quote, planning a trip, or asks a question that requires a detailed consultation, your secondary goal is to help them by starting a consultation request.
  
  To do this, you MUST use the 'submitConsultationRequest' function.
  
  Follow these steps for the consultation process:
  1.  Acknowledge their request and tell them you can help start the process.
  2.  Ask for their information ONE QUESTION AT A TIME. Do not ask for everything at once.
  3.  Start by asking for their full name. Then their email. Then their destination. These are required.
  4.  After you have the required information, you can ask for optional details like travel dates, number of travelers, etc.
  5.  Once you believe you have enough information, CONFIRM with the user before submitting. For example: "Great, I have all the details. Ready for me to submit this request for you?"
  6.  Only upon the user's confirmation, call the 'submitConsultationRequest' function with all the arguments you have collected.

  For general questions, use this key information:
  - Owner: Tim Perry
  - Contact: timothy@dreamscapetravels.com, 812-292-2066
  - Services: Cruises, Family Vacations, Solo Travel, Couples Getaways, Adventure Expeditions, All-Inclusive Resorts.`}],
};

// --- API POST HANDLER ---
export async function POST(request: Request) {
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-flash-latest",
        systemInstruction,
        tools,
    });

    try {
        const { messages } = await request.json();
        const lastMessage = messages[messages.length - 1];

        // ** FIX: Filter history to ensure it starts with a 'user' role **
        const conversationHistory = messages.slice(0, -1);
        if (conversationHistory.length > 0 && conversationHistory[0].role === 'bot') {
            conversationHistory.shift(); // Remove the initial bot message
        }

        const history = conversationHistory.map((msg: { role: 'user' | 'bot', text: string }) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }],
        }));

        const chat = model.startChat({ history });
        const result = await chat.sendMessage(lastMessage.text);
        const response = result.response;
        const functionCalls = response.functionCalls();

        if (functionCalls) {
            const call = functionCalls[0];
            if (call.name === 'submitConsultationRequest') {
                // --- Handle the function call ---
                const { name, args } = call;

                // Explicitly type args to match the expected properties
                type ConsultationArgs = {
                    fullName: string;
                    email: string;
                    destination: string;
                    phone?: string;
                    startDate?: string;
                    endDate?: string;
                    adults?: string;
                    children?: string;
                    budget?: string;
                    comments?: string;
                };
                const consultationArgs = args as ConsultationArgs;

                console.log("Function call detected, submitting consultation:", consultationArgs);

                const fromEmail = process.env.FROM_EMAIL;
                const timEmail = process.env.TIM_EMAIL;

                if (!fromEmail || !timEmail) {
                    throw new Error("Missing email configuration on the server.");
                }

                // Use the function arguments to send the email
                await resend.emails.send({
                    from: `AI Assistant <${fromEmail}>`,
                    to: [timEmail],
                    replyTo: consultationArgs.email,
                    subject: `AI-Assisted Request: ${consultationArgs.destination} for ${consultationArgs.fullName}`,
                    react: await ConsultationEmail({
                        ...consultationArgs,
                        phone: consultationArgs.phone ?? '',
                        startDate: consultationArgs.startDate ?? '',
                        endDate: consultationArgs.endDate ?? '',
                        adults: consultationArgs.adults ?? '',
                        children: consultationArgs.children ?? '',
                        budget: consultationArgs.budget ?? '',
                        comments: consultationArgs.comments ?? '',
                        tripType: (consultationArgs as any).tripType ?? '',
                        needs: (consultationArgs as any).needs ?? ''
                    }),
                });

                // Generate a final confirmation message for the user
                const finalResponse = await chat.sendMessage(JSON.stringify({
                    functionResponse: {
                        name: "submitConsultationRequest",
                        response: { success: true, message: "The consultation request was sent successfully." }
                    }
                }));

                return NextResponse.json({ reply: finalResponse.response.text() });
            }
        }

        // If no function call, just return the AI's text response
        return NextResponse.json({ reply: response.text() });

    } catch (error) {
        console.error('Chatbot API Error:', error);
        return NextResponse.json({ error: 'An internal error occurred.' }, { status: 500 });
    }
}
