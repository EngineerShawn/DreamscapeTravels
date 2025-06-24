import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        // --- Data Validation (Basic Example) ---
        if (!body.fullName || !body.email || !body.destination) {
            return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
        }

        console.log('--- NEW CONSULTATION REQUEST ---');
        console.log('Full Name:', body.fullName);
        console.log('Email:', body.email);
        console.log('Phone:', body.phone);
        console.log('Destination:', body.destination);
        console.log('Dates:', `${body.startDate} to ${body.endDate}`);
        console.log('Travelers:', `${body.adults} Adults, ${body.children} Children`);
        console.log('Trip Type:', body.tripType);
        console.log('Budget:', body.budget);
        console.log('Needs:', body.needs.join(', '));
        console.log('Comments:', body.comments);
        console.log('--------------------------------');

        // --- TODO: Integrate Real Sending Services ---

        // 1. SEND EMAIL TO TIM PERRY
        // Here you would use a service like SendGrid, Resend, or Nodemailer
        // Example: await sendEmail({ to: 'timothy@dreamscapetravels.com', subject: 'New Travel Request!', body: ... });

        // 2. SEND SMS TO TIM PERRY
        // Here you would use a service like Twilio
        // Example: await sendSms({ to: '+18122922066', body: `New Request from ${body.fullName} for ${body.destination}` });

        // --- End of Integration Section ---

        return NextResponse.json({ message: 'Form submitted successfully!' }, { status: 200 });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}