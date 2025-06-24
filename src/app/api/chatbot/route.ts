import { NextResponse } from 'next/server';
import {
    GoogleGenerativeAI,
    Part,
    FunctionDeclarationSchema,
} from "@google/generative-ai";
import ConsultationEmail from '@/components/ConsultationEmail';
import { Resend } from 'resend';

// --- INITIALIZE SERVICES ---
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is not defined.');
if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY is not defined.');

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const resend = new Resend(RESEND_API_KEY);

// --- DEFINE TYPES ---
interface ConsultationFormData {
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
}

// --- DEFINE AI TOOLS (FUNCTION CALLING) ---
const tools = [
    {
        functionDeclarations: [
            {
                name: "submitConsultationRequest",
                description: "Submits the user's travel consultation request. Only call this function when all required information has been collected from the user.",
                parameters: {
                    type: FunctionDeclarationSchema.Type.OBJECT,
                    properties: {
                        fullName: { type: FunctionDeclarationSchema.Type.STRING, description: "The user's full name." },
                        email: { type: FunctionDeclarationSchema.Type.STRING, description: "The user's email address." },
                        destination: { type: FunctionDeclarationSchema.Type.STRING, description: "The user's desired travel destination(s), as a comma-separated string." },
                        phone: { type: FunctionDeclarationSchema.Type.STRING, description: "The user's phone number. (Optional)" },
                        startDate: { type: FunctionDeclarationSchema.Type.STRING, description: "The user's approximate start date for the trip. (Optional)" },
                        endDate: { type: FunctionDeclarationSchema.Type.STRING, description: "The user's approximate end date for the trip. (Optional)" },
                        adults: { type: FunctionDeclarationSchema.Type.STRING, description: "The number of adults traveling as a string. (Optional, defaults to '1')" },
                        children: { type: FunctionDeclarationSchema.Type.STRING, description: "The number of children traveling as a string. (Optional, defaults to '0')" },
                        budget: { type: FunctionDeclarationSchema.Type.STRING, description: "The user's estimated budget per person. (Optional)" },
                        comments: { type: FunctionDeclarationSchema.Type.STRING, description: "Any additional comments or requests from the user. (Optional)" },
                    },
                    required: ["fullName", "email", "destination"],
                },
            },
        ],
    },
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
        model: "gemini-2.5-flash-latest",
        systemInstruction,
        tools,
    });

    try {
        const { messages } = await request.json();
        const lastMessage = messages[messages.length - 1];

        // ** FIX: Filter history to be valid **
        const conversationHistory = messages
            .slice(0, -1) // Exclude the last message which is the current user input
            .filter((msg: { text: string; }) => msg.text && msg.text.trim() !== ''); // Filter out any messages without text

        if (conversationHistory.length > 0 && conversationHistory[0].role === 'bot') {
            conversationHistory.shift(); // Remove the initial bot greeting if it's the first message
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
                const { name: _name, ...args } = call;

                console.log("Function call detected, submitting consultation:", args);

                const fromEmail = process.env.FROM_EMAIL;
                const timEmail = process.env.TIM_EMAIL;

                if (!fromEmail || !timEmail) {
                    throw new Error("Missing email configuration on the server.");
                }

                await resend.emails.send({
                    from: `AI Assistant <${fromEmail}>`,
                    to: [timEmail],
                    replyTo: args.email as string,
                    subject: `AI-Assisted Request: ${args.destination} for ${args.fullName}`,
                    react: ConsultationEmail(args as ConsultationFormData),
                });

                // ** FIX: Send the function response back to the model correctly **
                const functionResponsePart: Part = {
                    functionResponse: {
                        name: "submitConsultationRequest",
                        response: { success: true, message: "The consultation request was sent successfully." }
                    }
                };

                const finalResult = await chat.sendMessage([functionResponsePart]);
                return NextResponse.json({ reply: finalResult.response.text() });
            }
        }

        return NextResponse.json({ reply: response.text() });

    } catch (error) {
        console.error('Chatbot API Error:', error);
        return NextResponse.json({ error: 'An internal error occurred.' }, { status: 500 });
    }
}