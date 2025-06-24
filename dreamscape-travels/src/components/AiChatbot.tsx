'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, Spinner } from '@nextui-org/react';
import { MessageSquare, X, Send } from 'lucide-react';

type Message = {
    role: 'user' | 'bot';
    text: string;
};

export default function AiChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{ role: 'bot', text: "Hello! I'm Tim's AI Assistant. How can I help you with Dreamscape Travels today?" }]);
        }
    }, [isOpen, messages.length]);

    useEffect(() => {
        const timer = setTimeout(() => !isOpen && setShowTooltip(true), 10000);
        const hideTimer = setTimeout(() => setShowTooltip(false), 17000);
        return () => { clearTimeout(timer); clearTimeout(hideTimer); };
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', text: input };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chatbot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: newMessages }),
            });
            const data = await response.json();
            const botResponse: Message = { role: 'bot', text: data.reply };
            setMessages(prev => [...prev, botResponse]);
        } catch (error) {
            console.error("Chatbot API error:", error);
            const errorResponse: Message = { role: 'bot', text: "Sorry, I'm having a little trouble connecting right now. Please try again in a moment." };
            setMessages(prev => [...prev, errorResponse]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="fixed bottom-5 right-5 z-50">
                <div className="relative">
                    {showTooltip && (<div className="absolute bottom-full right-0 mb-2 p-2 bg-primary text-white text-sm rounded-lg shadow-lg whitespace-nowrap">Have questions? I can help!</div>)}
                    <Button isIconOnly color="primary" radius="full" size="lg" onPress={() => setIsOpen(true)} className="shadow-2xl"><MessageSquare /></Button>
                </div>
            </div>

            {isOpen && (
                <div className="fixed bottom-20 right-5 z-50 w-[350px] h-[500px] bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden border dark:border-zinc-700">
                    <div className="p-4 bg-gray-100 dark:bg-zinc-900 flex justify-between items-center border-b dark:border-zinc-700">
                        <h3 className="font-bold text-lg">Tim&apos;s AI Assistant</h3>
                        <Button isIconOnly variant="light" size="sm" onPress={() => setIsOpen(false)}><X /></Button>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto">
                        <div className="flex flex-col gap-4">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-zinc-700'}`}>
                                        <p className="text-sm">{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                            {isLoading && <div className="flex justify-start"><Spinner size="sm" /></div>}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    <div className="p-4 border-t dark:border-zinc-700">
                        <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                            <Input fullWidth placeholder="Ask a question..." value={input} onChange={(e) => setInput(e.target.value)} disabled={isLoading} />
                            <Button type="submit" isIconOnly color="primary" isLoading={isLoading} disabled={!input.trim()}><Send size={16} /></Button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
