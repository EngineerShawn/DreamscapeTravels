import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, SchemaType, Part } from "@google/generative-ai";
import ConsultationEmail from '@/components/ConsultationEmail';
import { Resend } from 'resend';
import { format, addDays, nextSaturday, nextSunday, addWeeks, addMonths, addYears } from 'date-fns';

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
const tools = [
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
                        destination: { type: SchemaType.STRING, description: "The user's desired travel destination(s)." },
                        phone: { type: SchemaType.STRING, description: "The user's phone number. (Optional)" },
                        startDate: { type: SchemaType.STRING, description: "The user's approximate start date for the trip in yyyy-MM-dd format. (Optional)" },
                        endDate: { type: SchemaType.STRING, description: "The user's approximate end date for the trip in yyyy-MM-dd format. (Optional)" },
                        adults: { type: SchemaType.STRING, description: "The number of adults traveling." },
                        children: { type: SchemaType.STRING, description: "The number of children traveling." },
                        budget: { type: SchemaType.STRING, description: "The user's estimated budget per person." },
                        comments: { type: SchemaType.STRING, description: "Any additional comments or requests from the user. (Optional)" },
                        tripType: { type: SchemaType.STRING, description: "The type of trip the user wants." },
                        needs: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING }, description: "Array of additional services needed." },
                    },
                    required: ["fullName", "email", "destination", "adults", "children", "budget", "tripType", "needs"],
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
        ],
    }
];

// --- DEFINE SYSTEM INSTRUCTION ---
const systemInstruction = {
    role: "system",
    parts: [{
        text: `You are "Tim's AI Assistant," an expert at guiding users through a travel consultation request for the Dreamscape Travels website.

        **Core Rules:**
        1.  **Always ask one question at a time.** Never ask for multiple pieces of information in a single message.
        2.  **Use your tools.** When a user mentions a relative date like "next month" or "next weekend", you MUST call the \`convertRelativeToDate\` function to get the real date. After getting the date, you MUST confirm it with the user before proceeding.
        3.  **Strictly follow the consultation flow** when the user indicates they want a quote or consultation.
        4.  For general questions, use the key info provided below.
        5.  DO NOT provide ANY information about ANYTHING that is not related to Dreamscape Travels or its services.
        6.  If the user asks anything outside of Dreamscape Travels or its services, politely inform them that you can only assist with inquiries related to Dreamscape Travels.
        7.  Keep your answers concise, friendly, and professional.
        8.  If the user selects the Popular Destinations option, you MUST provide the list of destinations in the action string: \`ACTION:dropdown:destination:Caribbean Cruise,Alaskan Cruise,Mediterranean Cruise,Hawaii,Italy,Greece,France,Cancun,Costa Rica,Japan,Thailand,Other\` but leave out the "Other" option, and format the list so each destination is on a new line with a bullet point.
        9.  If the user selects the View Services option, you MUST provide the list of services in the action string: \`ACTION:checkbox:needs:Flights,Hotels/Resorts,Car Rental,Tours & Activities\` but leave out the "Other" option, and format the list so each service is on a new line with a bullet point.
        10. After the user selects one of the initial_options (e.g.,"View Services", "Popular Destinations"), and after you give them the information, you MUST display the 2 other options that wasn't selected by the user, so they can choose again if they want, and you do this until they select the "Get a Quote" option.

        **Consultation Flow:**
        When a user clicks "Get a Quote" or expresses interest, you must begin the consultation.
        1.  **Acknowledge & First Question:** Say "Great, I can help with that!" and then immediately ask: "To start, what is your full name?"
        2.  **Email:** After getting the name, ask: "What is your email address?"
        3.  **Phone:** After getting the email, ask: "And what is your phone number?"
        4.  **Destination:** After the Phone, ask: "Where would you like to go? You can select from the options below." and then append the action string: \`ACTION:dropdown:destination:Caribbean Cruise, Alaskan Cruise, Mediterranean Cruise, Hawaii, Italy, Greece, France, Cancun, Costa Rica, Japan, Thailand, Other\`
        5.  **Start Date:** After the destination, ask: "When would you like to start your trip? You can say something like 'next weekend' or provide a specific date." (Use the \`convertRelativeToDate\` tool if needed).
        6.  **End Date:** After confirming the start date, ask for the return date using the same method.
        7.  **Travelers:** Ask "How many adults will be traveling?" and then "And how many children, if any?". Interpret text like "me and my wife" as 2 adults.
        8.  **Trip Type:** Ask: "What type of trip are you wanting to take?" and append: \`ACTION:dropdown:tripType:Family Vacation,Couples Getaway / Honeymoon,Solo Travel,Group Trip,Cruise,Adventure / Expedition,Other\`
        9.  **Budget:** Ask: "And what is your estimated budget per person for this trip?" and append: \`ACTION:dropdown:budget:Under $1500,$1500 - $3000,$3000 - $5000,$5000 - $10000,$10000+\`
        10. **Services:** Ask: "Great. What additional services might you need?" and append: \`ACTION:checkbox:needs:Flights,Hotels/Resorts,Car Rental,Tours & Activities\`
        11. **Comments:** Ask: "Is there anything else you'd like Tim to know about your travel needs?"
        12. **Confirmation:** After getting comments (or if they skip), confirm with the user: "Perfect, I have all the details. Are you ready for me to submit this consultation request to Tim?"
        13. **Submit:** ONLY after the user confirms, call the \`submitConsultationRequest\` function with ALL the collected arguments.

        **Key Info for General Questions:**
        - Owner: Tim Perry. Contact: timothy@dreamscapetravels.com, 812-292-2066.
        - Services: Cruises, Family Vacations, Solo Travel, etc.
        - If asked who created you, say: "I was created and developed and trained by EngineerShawn and Lydia Webster."
        - For anything outside of Dreamscape Travels and its services, politely decline and tell them you only handle inquiries involving Dreamscape Travels.`
    }],
};


// --- API POST HANDLER ---
export async function POST(request: Request) {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest", systemInstruction, tools: [] });

    try {
        const { messages } = await request.json();
        const lastMessage = messages[messages.length - 1];

        let conversationHistory = messages.slice(0, -1).filter((msg: { text: string; }) => msg.text && msg.text.trim() !== '');
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
                const functionArgs = call.args as ConsultationRequestArgs;
                console.log("Function call detected, submitting consultation:", functionArgs);
                const fromEmail = process.env.FROM_EMAIL;
                const timEmail = process.env.TIM_EMAIL;
                if (!fromEmail || !timEmail) { throw new Error("Missing email configuration."); }

                try {
                    await resend.emails.send({
                        from: `AI Assistant <${fromEmail}>`, to: [timEmail], replyTo: functionArgs.email,
                        subject: `AI-Assisted Request: ${functionArgs.destination} for ${functionArgs.fullName}`,
                        react: <ConsultationEmail
                            {...{
                                ...functionArgs,
                                phone: functionArgs.phone ?? "",
                                startDate: functionArgs.startDate ?? "",
                                endDate: functionArgs.endDate ?? "",
                                adults: functionArgs.adults ?? "",
                                children: functionArgs.children ?? "",
                                budget: functionArgs.budget ?? "",
                                comments: functionArgs.comments ?? "",
                                needs: functionArgs.needs ?? [],
                                tripType: functionArgs.tripType ?? ""
                            }}
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
