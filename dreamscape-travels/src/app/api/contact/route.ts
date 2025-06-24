import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import ConsultationEmail from '@/components/ConsultationEmail';

const resend = new Resend(process.env.RESEND_API_KEY);
const fromEmail = process.env.FROM_EMAIL;
const timEmail = process.env.TIM_EMAIL;
const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY;

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { recaptchaToken, ...formData } = body;

        // --- 1. Verify reCAPTCHA token if it exists (for the modal form) ---
        if (recaptchaToken) {
            if (!recaptchaSecretKey) {
                console.error("reCAPTCHA secret key is not set.");
                return NextResponse.json({ message: 'Server configuration error for reCAPTCHA.' }, { status: 500 });
            }
            const recaptchaVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}&response=${recaptchaToken}`;
            const recaptchaRes = await fetch(recaptchaVerifyUrl, { method: 'POST' });
            const recaptchaJson = await recaptchaRes.json();

            if (!recaptchaJson.success) {
                console.error("reCAPTCHA verification failed:", recaptchaJson['error-codes']);
                return NextResponse.json({ message: 'reCAPTCHA verification failed.' }, { status: 400 });
            }
        }
        // If no token, we assume it's a trusted request from our chatbot API.

        // --- 2. Validate form data ---
        if (!formData.fullName || !formData.email || !formData.destination) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }
        if (!process.env.RESEND_API_KEY || !fromEmail || !timEmail) {
            console.error('Missing required environment variables for sending email.');
            return NextResponse.json({ message: 'Server configuration error.' }, { status: 500 });
        }

        // --- 3. Send Email Notification ---
        const consultationEmail = await ConsultationEmail(formData);

        await resend.emails.send({
            from: `Dreamscape Travels <${fromEmail}>`,
            to: [timEmail],
            replyTo: formData.email,
            subject: `New Travel Request: ${formData.destination} for ${formData.fullName}`,
            react: consultationEmail,
        });

        return NextResponse.json({ message: 'Form submitted successfully!' }, { status: 200 });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}
