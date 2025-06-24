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
const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { recaptchaToken, ...formData } = body;

        // --- 1. Verify reCAPTCHA token ---
        if (!recaptchaToken) {
            return NextResponse.json({ message: 'reCAPTCHA verification failed.' }, { status: 400 });
        }
        const recaptchaVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}&response=${recaptchaToken}`;
        const recaptchaRes = await fetch(recaptchaVerifyUrl, { method: 'POST' });
        const recaptchaJson = await recaptchaRes.json();

        if (!recaptchaJson.success || recaptchaJson.score < 0.5) { // score check for v3, success for v2
            console.error("reCAPTCHA verification failed:", recaptchaJson['error-codes']);
            return NextResponse.json({ message: 'reCAPTCHA verification failed.' }, { status: 400 });
        }

        // --- 2. Validate form data ---
        if (!formData.fullName || !formData.email || !formData.destination) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }
        if (!process.env.RESEND_API_KEY || !fromEmail || !timEmail || !timSmsGateway) {
            console.error('Missing required environment variables for sending notifications.');
            return NextResponse.json({ message: 'Server configuration error.' }, { status: 500 });
        }

        // --- 3. Send Notifications ---
        const consultationEmailContent = await ConsultationEmail(formData);

        await resend.emails.send({
            from: `Dreamscape Travels <${fromEmail}>`,
            to: [timEmail],
            replyTo: formData.email,
            subject: `New Travel Request: ${formData.destination} for ${formData.fullName}`,
            react: consultationEmailContent,
        });

        await resend.emails.send({
            from: `Alert <${fromEmail}>`,
            to: [timSmsGateway],
            subject: `New Request`,
            text: `Dreamscape Travels: New consultation request from ${formData.fullName} for ${formData.destination}. Check email.`,
        });

        return NextResponse.json({ message: 'Form submitted successfully!' }, { status: 200 });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}