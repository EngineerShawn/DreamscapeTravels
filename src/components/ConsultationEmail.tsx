import * as React from 'react';
import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Preview,
    Section,
    Text,
    Tailwind,
} from '@react-email/components';

interface ConsultationEmailProps {
    fullName: string;
    email: string;
    phone: string;
    destination: string;
    startDate: string;
    endDate: string;
    adults: string;
    children: string;
    tripType: string;
    budget: string;
    needs: string[];
    comments: string;
}

const ConsultationEmail: React.FC<Readonly<ConsultationEmailProps>> = ({
    fullName, email, phone, destination, startDate, endDate, adults, children, tripType, budget, needs, comments
}) => (
    <Html>
        <Head />
        <Preview>New Travel Consultation Request from {fullName}</Preview>
        <Tailwind>
            <Body className="bg-gray-100 font-sans">
                <Container className="bg-white border border-gray-200 rounded-lg mx-auto p-8 my-8">
                    <Heading className="text-2xl font-bold text-gray-800">New Travel Consultation Request</Heading>
                    <Text className="text-gray-600">You have received a new consultation request from your website.</Text>

                    <Section>
                        <Heading as="h2" className="text-lg font-semibold text-gray-700 mt-6 mb-2">Client Information</Heading>
                        <Hr className="border-gray-300" />
                        <Text><strong>Name:</strong> {fullName}</Text>
                        <Text><strong>Email:</strong> {email}</Text>
                        {phone && <Text><strong>Phone:</strong> {phone}</Text>}
                    </Section>

                    <Section>
                        <Heading as="h2" className="text-lg font-semibold text-gray-700 mt-6 mb-2">Trip Details</Heading>
                        <Hr className="border-gray-300" />
                        <Text><strong>Destination:</strong> {destination}</Text>
                        <Text><strong>Dates:</strong> {startDate || 'N/A'} to {endDate || 'N/A'}</Text>
                        <Text><strong>Travelers:</strong> {adults} Adult(s), {children} Child(ren)</Text>
                        <Text><strong>Trip Type:</strong> {tripType || 'N/A'}</Text>
                        <Text><strong>Budget (per person):</strong> {budget || 'N/A'}</Text>
                        <Text><strong>Services Needed:</strong> {needs?.join(', ') || 'N/A'}</Text>
                    </Section>

                    {comments && (
                        <Section>
                            <Heading as="h2" className="text-lg font-semibold text-gray-700 mt-6 mb-2">Additional Comments</Heading>
                            <Hr className="border-gray-300" />
                            <Text className="bg-gray-50 p-4 rounded-md border border-gray-200">{comments}</Text>
                        </Section>
                    )}

                </Container>
            </Body>
        </Tailwind>
    </Html>
);

export default ConsultationEmail;