'use client';
import * as React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Button, Spinner } from '@nextui-org/react';
import { MessageSquare, X, Send, Plus, Wand2, Mic, ArrowUp, Upload } from 'lucide-react';

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
    const [showInitialOptions, setShowInitialOptions] = useState(true);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const textareaRef = useRef<null | HTMLTextAreaElement>(null);

    // Initial welcome message
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{
                role: 'bot',
                text: "Hello! I'm Tim's AI Assistant. How can I help you plan your dream vacation today?",
            }]);
            setShowInitialOptions(true);
        }
    }, [isOpen]);

    // Proactive tooltip
    useEffect(() => {
        const timer = setTimeout(() => !isOpen && setShowTooltip(true), 20000);
        const hideTimer = setTimeout(() => setShowTooltip(false), 17000);
        return () => { clearTimeout(timer); clearTimeout(hideTimer); };
    }, [isOpen]);

    // Auto-scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            const scrollHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height = `${Math.min(scrollHeight, 120)}px`;
        }
    }, [input]);

    const handleSendMessage = async (e?: React.FormEvent, messageText?: string) => {
        if (e) e.preventDefault();

        const textToSend = messageText || input;
        if (!textToSend.trim() || isLoading) return;

        setShowInitialOptions(false);
        const userMessage: Message = { role: 'user', text: textToSend };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const response = await fetch('/api/chatbot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...messages, userMessage] }),
            });
            const data = await response.json();
            const botResponse: Message = { role: 'bot', text: data.reply };
            setMessages(prev => [...prev, botResponse]);
        } catch (error) {
            console.error("Chatbot API error:", error);
            const errorResponse: Message = { role: 'bot', text: "Sorry, I'm having trouble connecting right now." };
            setMessages(prev => [...prev, errorResponse]);
        } finally {
            setIsLoading(false);
        }
    };

    function UploadFile(): void {
        // Create a hidden file input element
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '*';
        input.style.display = 'none';

        input.onchange = async (event: Event) => {
            const target = event.target as HTMLInputElement;
            if (target.files && target.files.length > 0) {
                const file = target.files[0];
                // For now, just show the file name in the chat as a user message
                setMessages(prev => [
                    ...prev,
                    { role: 'user', text: `Uploaded file: ${file.name}` }
                ]);
                setShowInitialOptions(false);
                // You can add actual upload logic here if needed
            }
        };
        

        document.body.appendChild(input);
        input.click();
        // Clean up the input after use
        input.remove();
    }

    return (
        <>
            <div className="fixed bottom-5 right-5 z-50">
                <div className="relative">
                    {showTooltip && (<div className="absolute bottom-full right-0 mb-2 p-2 bg-primary text-white text-sm rounded-lg shadow-lg whitespace-nowrap">Have questions? I can help!</div>)}
                    <Button isIconOnly color="primary" radius="full" size="lg" onPress={() => setIsOpen(!isOpen)} className="shadow-2xl"><MessageSquare /></Button>
                </div>
            </div>

            {isOpen && (
                <div className="fixed bottom-20 right-5 z-50 w-[370px] h-[600px] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border dark:border-zinc-700">
                    <div className="p-2 pl-4 bg-gray-100 drop-shadow-md dark:bg-zinc-800 flex justify-between items-center dark:border-zinc-700">
                        <h3 className=" font-sans font-normal  text-lg drop-shadow-lg">Tim's AI Assistant</h3>
                        <Button isIconOnly variant="light" size="sm" onPress={() => setIsOpen(false)}><X /></Button>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto">
                        <div className="flex flex-col gap-4">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-3 rounded-2xl ${msg.role === 'user' ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-zinc-900'}`}><p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p></div>
                                </div>
                            ))}
                            {isLoading && <div className="flex justify-start"><Spinner size="sm" /></div>}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    <div className="p-3 border-t dark:border-zinc-700">
                        {showInitialOptions && (
                            <div className="grid grid-cols-3 gap-2 mb-2">
                                <Button size="sm" variant='light' className="border-1" onPress={() => handleSendMessage(undefined, "Get a Quote")}>Get a Quote</Button>
                                <Button size="sm" variant='light' className="border-1" onPress={() => handleSendMessage(undefined, "View Services")}>View Services</Button>
                                <Button size="sm" variant='light' className="border-1" onPress={() => handleSendMessage(undefined, "Popular Destinations")}>Destinations</Button>
                            </div>
                        )}
                        <form onSubmit={handleSendMessage} className="bg-gray-100 dark:bg-zinc-800 rounded-xl p-3 pb-2 flex flex-col gap-2">
                            <textarea
                                ref={textareaRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                                placeholder="Ask anything..."
                                className="w-full bg-transparent text-sm resize-none focus:outline-none placeholder-gray-500 dark:placeholder-gray-400"
                                rows={1}
                                disabled={isLoading}
                            />
                            <div className="flex items-center gap-2">
                                <Button className="" isIconOnly size="sm" variant="light" onPress={() => UploadFile()}><Plus size={18} /></Button>
                                <Button isIconOnly size="sm" variant="light" onPress={() => alert("Tools coming soon!")}><Wand2 size={18} /></Button>
                                <div className="flex-grow"></div>
                                <Button isIconOnly size="sm" variant="light" onPress={() => alert("Voice input coming soon!")}><Mic size={18} /></Button>
                                <Button  isIconOnly size="md" color="primary" type="submit" isDisabled={!input.trim()} isLoading={isLoading}
                                    className={`${!input.trim() ? 'bg-gray-300 dark:bg-zinc-700' : ''}`}
                                >
                                    {isLoading ? "" : <ArrowUp size={18} />}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
