'use client';
import React from "react";
import AppNavbar from "@/components/AppNavbar";
import AppFooter from "@/components/AppFooter";
import { Input, Textarea, Button, Select, SelectItem } from "@nextui-org/react";

export default function ContactUsPage() {
    const [status, setStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setStatus('loading');
        // Add form submission logic here (e.g., send to an API endpoint)
        console.log("Form submitted");
        // Simulate network request
        setTimeout(() => setStatus('success'), 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 flex flex-col">
            <AppNavbar />
            <main className="flex-grow flex items-center justify-center p-8">
                <div className="max-w-xl w-full bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-lg">
                    <h1 className="text-4xl font-bold font-serif mb-2 text-gray-900 dark:text-white">Contact Us</h1>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">Have an issue or a question? Fill out the form below and we&apos;ll get back to you.</p>

                    {status === 'success' ? (
                        <div className="text-center py-10">
                            <h2 className="text-2xl font-bold text-green-500">Message Sent!</h2>
                            <p className="mt-2 text-foreground/80">Thank you for reaching out. We will get back to you as soon as possible.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            <Input isRequired label="Your Name" />
                            <Input isRequired type="email" label="Your Email" />
                            <Select isRequired label="Reason for Contact">
                                <SelectItem key="bug">Report a Bug</SelectItem>
                                <SelectItem key="support">General Support</SelectItem>
                                <SelectItem key="feedback">Feedback</SelectItem>
                                <SelectItem key="other">Other</SelectItem>
                            </Select>
                            <Textarea isRequired label="Your Message" minRows={5} />
                            <Button type="submit" color="primary" isLoading={status === 'loading'}>
                                Send Message
                            </Button>
                            {status === 'error' && <p className="text-danger text-center mt-2">Failed to send message. Please try again.</p>}
                        </form>
                    )}
                </div>
            </main>
            <AppFooter />
        </div>
    );
}
