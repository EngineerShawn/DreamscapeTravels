import dotenv from 'dotenv';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import ConsultationEmail from '@/components/ConsultationEmail';


// Load environment variables from .env filename
dotenv.config({ path: '../../../../.env' });

// Initialize Resend with your API key from environment variables
const resend = new Resend(process.env.RESEND_API_KEY);

// Define the 'from' email address from environment variables
const fromEmail = process.env.FROM_EMAIL;
// Define Tim's contact info from environment variables
const timEmail = process.env.DEV_EMAIL;
const timSmsGateway = process.env.SHAWN_SMS_GATEWAY;

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // --- Data Validation ---
        if (!body.fullName || !body.email || !body.destination) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        // Ensure environment variables are set
        if (!process.env.RESEND_API_KEY || !fromEmail || !timEmail || !timSmsGateway) {
            console.error('Missing required environment variables for sending notifications.');
            return NextResponse.json({ message: 'Server configuration error.' }, { status: 500 });
        }

        // --- 1. SEND DETAILED EMAIL TO TIM ---
        const emailResponse = await resend.emails.send({
            from: `Dreamscape Travels <${fromEmail}>`,
            to: [timEmail],
            replyTo: body.email,
            subject: `New Travel Request: ${body.destination} for ${body.fullName}`,
            react: await ConsultationEmail(body),
        });

        console.log('Email sent successfully:', emailResponse);

        // --- 2. SEND SMS ALERT TO TIM ---
        // This is sent as a second, simple email to the phone's SMS gateway address.
        const smsResponse = await resend.emails.send({
            from: `Alert <${fromEmail}>`,
            to: [`${timSmsGateway}`],
            subject: `New Request`, // Subject is often ignored by SMS gateways
            text: `Dreamscape Travels: New consultation request from ${body.fullName} for ${body.destination}. Check your email for details.`,
        });

        console.log('SMS alert sent successfully:', smsResponse);


        return NextResponse.json({ message: 'Form submitted successfully!' }, { status: 200 });

    } catch (error) {
        console.error('API Error:', error);
        if (error instanceof Error) {
            return NextResponse.json({ message: 'Internal Server Error', error: error.message }, { status: 500 });
        }
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
