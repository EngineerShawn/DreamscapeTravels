/* eslint-disable react/no-children-prop */
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType, Part } from "@google/generative-ai";
import ConsultationEmail from '@/components/ConsultationEmail';
import { Resend } from 'resend';
import { format, nextSaturday, nextSunday, addWeeks, addMonths, addYears } from 'date-fns';

// --- DEFINE TYPES ---
interface ConsultationRequestArgs {
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
    tripType: string;
    needs: string[];
}

// --- INITIALIZE SERVICES ---
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const RESEND_API_KEY = process.env.RESEND_API_KEY;

if (!GEMINI_API_KEY) throw new Error('GEMINI_API_KEY is not defined.');
if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY is not defined.');

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const resend = new Resend(RESEND_API_KEY);

// --- DEFINE AI TOOLS (FUNCTION CALLING) ---
const tool = [
    {
        functionDeclarations: [
            {
                name: "submitConsultationRequest",
                description: "Submits the user's travel consultation request. Only call this function when all required information has been collected and the user has confirmed they want to submit.",
                parameters: {
                    type: SchemaType.OBJECT,
                    properties: {
                        fullName: { type: SchemaType.STRING, description: "The user's full name." },
                        email: { type: SchemaType.STRING, description: "The user's email address." },
                        phone: { type: SchemaType.STRING, description: "The user's phone number." },
                        destination: { type: SchemaType.STRING, description: "The user's desired travel destination(s)." },
                        startDate: { type: SchemaType.STRING, description: "The user's approximate start date for the trip in MM-dd-yyyy format." },
                        endDate: { type: SchemaType.STRING, description: "The user's approximate end date for the trip in MM-dd-yyyy format." },
                        adults: { type: SchemaType.STRING, description: "The number of adults traveling." },
                        children: { type: SchemaType.STRING, description: "The number of children traveling." },
                        budget: { type: SchemaType.STRING, description: "The user's estimated budget per person." },
                        comments: { type: SchemaType.STRING, description: "Any additional comments or requests from the user. (Optional)" },
                        tripType: { type: SchemaType.STRING, description: "The type of trip the user wants." },
                        needs: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: "Array of additional services needed." },
                    },
                    required: ["fullName", "email", "phone", "destination",  "adults", "children", "budget", "tripType", "needs"],
                },
            },
            {
                name: "convertRelativeToDate",
                description: "Converts relative time descriptions (e.g., 'next weekend', 'in two months') into a specific date. Use this to clarify dates with the user.",
                parameters: {
                    type: SchemaType.OBJECT,
                    properties: {
                        relativeText: { type: SchemaType.STRING, description: "The relative date text from the user, e.g., 'next weekend'." },
                    },
                    required: ["relativeText"],
                }
            }
        ]
    }
];


// --- DEFINE SYSTEM INSTRUCTION ---
const systemInstruction = {
    role: "system",
    parts: [{
        text: `You are "Tim's AI Assistant," an expert at guiding users through a travel consultation request for the Dreamscape Travels website.

        **IMPORTANT Instructions:**
        Default message should be formatted like this:
        \`\`\`
            Hey there! I am **Tim's AI Assistant**.
            How can I help you plan your dream vacation today?
        \`\`\`


        **Core Rules:**
        1.  **Always ask one question at a time.** Never ask for multiple pieces of information in a single message.
        2.  **Use your tools.** When a user mentions a relative date like "next month" or "next weekend", you MUST call the \`convertRelativeToDate\` function to get the real date. After getting the date, you MUST confirm it with the user before proceeding.
        3.  **Strictly follow the consultation flow** when the user indicates they want a quote or consultation.
        4.  For general questions, use the key info provided below.
        5.  If the user asks anything outside of Dreamscape Travels or its services, politely inform them that you can only assist with inquiries related to Dreamscape Travels.
        6.  Keep your answers concise, friendly, and professional.
        7.  If the user asks who created you, say: "I was created and developed by EngineerShawn, a Full-Stack Software Engineer and AI Engineer."
        8.  **Crucial Action Rule:** When you append an \`ACTION:...\` string, your text response MUST ONLY contain the question itself. DO NOT list the options in your text response.
        9. **Response Formatting (MANDATORY):** You MUST format informational responses using Markdown headings, bold text, and bullet points for readability. For example, when asked about services, you MUST respond in this exact format:

            **Our Services**

            We offer a variety of travel planning services to create your perfect escape:

            * **Cruises:** Ocean and river cruises to destinations worldwide.
            * **Family Vacations:** All-inclusive resorts, theme parks, and custom family adventures.
            * **Couples Getaways:** Romantic trips, honeymoons, and anniversary celebrations.
            * **And much more!**

        **Consultation Flow (The structured process for "Get a Quote" or after pivoting from other flows):**
        * **Always ask one question at a time.**
        * When a user gives a relative date (e.g., "next weekend", "next month", etc), you MUST call the \`convertRelativeToDate\` tool and then CONFIRM the result with the user (e.g., "Okay, so you'd like to leave on Saturday, June 28, 2025. Is that correct?").
        * **Question Order:** Full Name -> Email -> Phone Number -> Destination (if not already known) -> Start Date -> End Date -> Number of Adults -> Number of Children -> Trip Type (If not already known) -> Budget -> Additional Services -> Comments -> Final Confirmation.
        * **Interactive Elements:** To ask for specific input, append an action string to your response. The frontend will render an interactive component.
            * Destination: \`ACTION:dropdown:Destination:Caribbean Cruise,Alaskan Cruise,Hawaii,Italy,Greece,Cancun,Other\`
            * Trip Type: \`ACTION:dropdown:Trip Type:Family Vacation,Couples Getaway,Adventure,Cruise,Relaxation,Other\`
            * Budget: \`ACTION:dropdown:Budget (per person):Under $1500,$1500 - $3000,$3000 - $5000,$5000+\`
            * Services: \`ACTION:checkbox:Additional Services:Flights,Hotels/Resorts,Car Rental,Tours & Activities\`
        * **Submit:** ONLY after the user gives final confirmation ("Yes", "Submit it", etc.), call the \`submitConsultationRequest\` function with ALL the collected arguments.`
    }],
};

// --- API POST HANDLER ---
export async function POST(request: Request) {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", systemInstruction, ...tool });

    try {
        const { messages } = await request.json();
        const lastMessage = messages[messages.length - 1];

        const conversationHistory = messages.slice(0, -1).filter((msg: { text: string; }) => msg.text && msg.text.trim() !== '');
        if (conversationHistory.length > 0 && conversationHistory[0].role === 'bot') { conversationHistory.shift(); }

        const history = conversationHistory.map((msg: { role: 'user' | 'bot', text: string }) => ({ role: msg.role === 'user' ? 'user' : 'model', parts: [{ text: msg.text }] }));

        const chat = model.startChat({ history });
        const result = await chat.sendMessage(lastMessage.text);
        const response = result.response;
        const functionCalls = response.functionCalls();

        if (functionCalls) {
            const call = functionCalls[0];
            let functionResponsePart: Part;

            if (call.name === 'submitConsultationRequest') {
                const functionArgs = call.args as Partial<ConsultationRequestArgs>;
                console.log("Function call detected, submitting consultation:", functionArgs);
                const fromEmail = process.env.FROM_EMAIL;
                const timEmail = process.env.TIM_EMAIL;
                if (!fromEmail || !timEmail) { throw new Error("Missing email configuration."); }

                try {
                    await resend.emails.send({
                        from: `Tim's AI Assistant <${fromEmail}>`, to: [timEmail], replyTo: functionArgs.email,
                        subject: `New Consultation Request: ${functionArgs.destination} for ${functionArgs.fullName}`,
                        react: <ConsultationEmail
                            fullName={functionArgs.fullName || "N/A"}
                            email={functionArgs.email || "N/A"}
                            destination={functionArgs.destination || "N/A"}
                            phone={functionArgs.phone || "Not provided"}
                            startDate={functionArgs.startDate || "Not provided"}
                            endDate={functionArgs.endDate || "Not provided"}
                            adults={functionArgs.adults || "Not provided"}
                            children={functionArgs.children || "Not provided"}
                            budget={functionArgs.budget || "Not provided"}
                            comments={functionArgs.comments || "None"}
                            needs={functionArgs.needs || []}
                            tripType={functionArgs.tripType || "Not specified"}
                        />,
                    });
                    functionResponsePart = { functionResponse: { name: "submitConsultationRequest", response: { success: true } } };
                } catch (emailError) {
                    console.error("Resend API Error:", emailError);
                    functionResponsePart = { functionResponse: { name: "submitConsultationRequest", response: { success: false } } };
                }
            } else if (call.name === 'convertRelativeToDate') {
                const { relativeText } = call.args as { relativeText: string };
                let calculatedDate = new Date();
                const today = new Date();
                const lowerText = (relativeText || "").toLowerCase();

                if (lowerText.includes("next weekend")) calculatedDate = nextSaturday(today);
                else if (lowerText.includes("following weekend")) calculatedDate = nextSaturday(addWeeks(today, 1));
                else if (lowerText.includes("next month")) calculatedDate = addMonths(today, 1);
                else if (lowerText.includes("next week")) calculatedDate = nextSunday(today);
                else if (lowerText.includes("in two weeks")) calculatedDate = addWeeks(today, 2);
                else if (lowerText.includes("in three weeks")) calculatedDate = addWeeks(today, 3);
                else if (lowerText.includes("in a month")) calculatedDate = addMonths(today, 1);
                else if (lowerText.includes("in two months")) calculatedDate = addMonths(today, 2);
                else if (lowerText.includes("next year")) calculatedDate = addYears(today, 1);

                functionResponsePart = {
                    functionResponse: { name: "convertRelativeToDate", response: { date: format(calculatedDate, 'MM-dd-yyyy') } }
                };
            } else {
                functionResponsePart = { functionResponse: { name: call.name, response: { error: "Unknown function" } } };
            }

            const finalResult = await chat.sendMessage([functionResponsePart]);
            return NextResponse.json({ reply: finalResult.response.text() });
        }

        return NextResponse.json({ reply: response.text() });

    } catch (error) {
        console.error('Chatbot API Error:', error);
        return NextResponse.json({ error: 'An internal error occurred.' }, { status: 500 });
    }
}
