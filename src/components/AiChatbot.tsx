/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Button, Spinner, Select, SelectItem, CheckboxGroup, Checkbox } from '@nextui-org/react';
import { MessageSquare, X, ArrowUp, Plus, Wand2, Mic } from 'lucide-react';

// A simple component to render Markdown text
const MarkdownText = ({ text }: { text: string }) => {
    // This regex finds **bold text** and * list items, then converts to HTML
    const formattedText = text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Bold
        .replace(/\n\s*-\s/g, '<br/>• ') // List items using hyphen
        .replace(/\n\s*\*\s/g, '<br/>• ') // List items using asterisk
        .replace(/(\n\s*•\s)/g, '<br/>• ') // List items with bullet points
        .replace(/(\n\s*\*)/g, '<br/>• ') // List items
        .replace(/\n/g, '<br/>'); // New lines

    return <p className="text-sm leading-relaxed whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: formattedText }} />;
};


type Message = {
    role: 'user' | 'bot';
    text: string;
    timestamp: string;
};

type InteractiveInput = {
    type: 'dropdown' | 'checkbox';
    label: string;
    options: string[];
    selection: string | string[];
};

export default function AiChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [interactiveInput, setInteractiveInput] = useState<InteractiveInput | null>(null);
    const messagesEndRef = useRef<null | HTMLDivElement>(null);
    const textareaRef = useRef<null | HTMLTextAreaElement>(null);

    const hasText = input.trim() !== '';

    // let the AI Generate a random welcome message user opens chatbot
    const welcomeMessages = [
        "Hey there! I am **Tim's AI Assistant**. How can I help you plan your dream vacation today?",
        "Hello! Ready to plan your next adventure? I'm **Tim's AI Assistant**, here to help!",
        "Hi! I'm **Tim's AI Assistant**. What kind of dream trip are you looking to create?",
        "Welcome! As **Tim's AI Assistant**, I'm excited to help you with your travel plans. What's on your mind?",
        "Greetings! I'm **Tim's AI Assistant**. Let's start planning your perfect getaway. Where would you like to go?"
    ];

    const getRandomWelcomeMessage = () => {
        const randomIndex = Math.floor(Math.random() * welcomeMessages.length);
        return welcomeMessages[randomIndex];
    };


    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([{
                role: 'bot',
                text: `${getRandomWelcomeMessage()}`,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }]);
        }
    }, [isOpen]);

    useEffect(() => {
        const timer = setTimeout(() => !isOpen && setShowTooltip(true), 10000);
        const hideTimer = setTimeout(() => setShowTooltip(false), 17000);
        return () => { clearTimeout(timer); clearTimeout(hideTimer); };
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, interactiveInput]);

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            const scrollHeight = textareaRef.current.scrollHeight;
            textareaRef.current.style.height = `${Math.min(scrollHeight, 120)}px`;
        }
    }, [input]);

    const processBotResponse = (reply: string) => {
        const actionRegex = /ACTION:(\w+):([^:]+):([\w\s,/-]+)/;
        const match = reply.match(actionRegex);

        const cleanReply = reply.replace(actionRegex, "").trim();
        const botMessage: Message = {
            role: 'bot',
            text: cleanReply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, botMessage]);

        if (match) {
            const [, type, label, optionsStr] = match;
            const options = optionsStr.split(',');
            if (type === 'dropdown' || type === 'checkbox') {
                setInteractiveInput({ type, label, options, selection: type === 'checkbox' ? [] : '' });
            }
        }
    };

    const handleSendMessage = async (e?: React.FormEvent, messageText?: string) => {
        if (e) e.preventDefault();
        const textToSend = messageText || input;
        if (!textToSend.trim() || isLoading) return;

        const userMessage: Message = {
            role: 'user',
            text: textToSend,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setInteractiveInput(null);
        // If there is no selection in interactive input, do not let the page reload
        // this is to prevent the page reloading and the chat resetting if they user didn't select anything from the interactive input
        if (interactiveInput && !interactiveInput.selection) {
            // prevent the page from reloading
            e?.preventDefault();
        }

        try {
            const response = await fetch('/api/chatbot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ messages: [...messages, userMessage] }),
            });
            const data = await response.json();
            processBotResponse(data.reply);
        } catch (error) {
            console.error("Chatbot API error:", error);
            setMessages(prev => [...prev, { role: 'bot', text: "Sorry, I'm having trouble connecting.", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        } finally {
            setIsLoading(false);
            // After the user presses enter or clicks send, keep the textareaRef focused
            if (textareaRef.current) {
                textareaRef.current.focus();
            };
        }
    };

    const handleInteractiveSubmit = (e: React.FormEvent) => {
        if (!interactiveInput) return;
        const selectionText = Array.isArray(interactiveInput.selection) ? interactiveInput.selection.join(', ') : interactiveInput.selection;
        if (!selectionText) return;
        handleSendMessage(e, `My selection is: ${selectionText}`);
    };

    return (
        <>
            <div className="fixed bottom-5 right-5 z-50">

{/*-------AI Chatbot button is commented out until AI is fixed, Deploying site for client-------------*/}

                {/* <div className="relative">
                    {showTooltip && (<div className="absolute bottom-full right-0 mb-2 p-2 bg-primary text-white text-sm rounded-lg shadow-lg whitespace-nowrap">Have questions? I can help!</div>)}
                    <Button isIconOnly color="primary" radius="full" size="lg" onPress={isOpen ? () => setIsOpen(false) : () => setIsOpen(true)} className="shadow-lg shadow-neutral-950"><MessageSquare /></Button>
                </div> */}
            </div>

            {isOpen && (
                <div className="fixed bottom-20 right-5 z-50 w-[370px] h-[600px] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border dark:border-zinc-700 dark:shadow-black">
                    <div className="p-2 bg-gray-100 dark:bg-zinc-800 flex justify-between items-center shadow-md shadow-neutral-950 dark:border-zinc-700">
                        <h3 className="font-bold text-lg">Tim&apos;s AI Assistant</h3>
                        <Button isIconOnly variant="light" size="sm" onPress={() => setIsOpen(false)}><X /></Button>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto">
                        <div className="flex flex-col gap-1">
                            {messages.map((msg, index) => (
                                <div key={index} className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                                    <div className={`max-w-[85%] p-3 rounded-2xl ${msg.role === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-gray-200 dark:bg-zinc-700 rounded-bl-none'}`}>
                                        <MarkdownText text={msg.text} />
                                    </div>
                                    <span className="text-xs text-gray-400 mt-1 px-1">
                                        {msg.role === 'bot' ? 'AI Assistant' : 'You'} at {msg.timestamp}
                                    </span>
                                </div>
                            ))}
                            {isLoading && <div className="flex justify-start pt-2"><Spinner size="sm" /></div>}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    <div className="p-3 border-t dark:border-zinc-700">
                        {messages.length <= 1 && (
                            <div className="grid grid-cols-3 gap-2 mb-2">
                                <Button size="sm" variant="bordered" onPress={() => handleSendMessage(undefined, "Get a Quote")}>Get a Quote</Button>
                                <Button size="sm" variant="bordered" onPress={() => handleSendMessage(undefined, "Plan a Trip")}>Plan a Trip</Button>
                                <Button size="sm" variant="bordered" onPress={() => handleSendMessage(undefined, "Trip Ideas")}>Trip Ideas</Button>
                            </div>
                        )}
                        {interactiveInput && (
                            <form onSubmit={handleInteractiveSubmit} className="flex flex-col gap-2 p-3 mb-2 bg-gray-100 dark:bg-zinc-800 rounded-xl">
                                <span className="text-sm font-semibold">{interactiveInput.label}</span>
                                {interactiveInput.type === 'dropdown' && (
                                    <Select label="Select an option" size="sm" selectedKeys={interactiveInput.selection ? [interactiveInput.selection as string] : []} onChange={(e) => setInteractiveInput({ ...interactiveInput, selection: e.target.value })}>
                                        {interactiveInput.options.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                    </Select>
                                )}
                                {interactiveInput.type === 'checkbox' && (
                                    <CheckboxGroup value={interactiveInput.selection as string[]} onValueChange={(val) => setInteractiveInput({ ...interactiveInput, selection: val })}>
                                        {interactiveInput.options.map(opt => <Checkbox key={opt} value={opt}>{opt}</Checkbox>)}
                                    </CheckboxGroup>
                                )}
                                <Button type="submit" size="sm" color="primary">Confirm Selection</Button>
                            </form>
                        )}
                        <form onSubmit={handleSendMessage} className="bg-gray-100 dark:bg-zinc-800 rounded-xl p-2 flex flex-col gap-2">
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
                                className="w-full bg-transparent text-sm resize-none focus:outline-none placeholder-gray-500 dark:placeholder-gray-400 p-2"
                                rows={1}
                                disabled={isLoading || !!interactiveInput}
                            />
                            <div className="flex items-center gap-2">
                                <Button isIconOnly size="sm" variant="light" onPress={() => alert("File attachment coming soon!")}><Plus size={18} /></Button>
                                <Button isIconOnly size="sm" variant="light" onPress={() => alert("Tools coming soon!")}><Wand2 size={18} /></Button>
                                <div className="flex-grow"></div>
                                <Button isIconOnly size="sm" variant="light" onPress={() => alert("Voice input coming soon!")}><Mic size={18} /></Button>
                                <Button isIconOnly size="md" color="primary" type="submit" isDisabled={!hasText || !!interactiveInput} isLoading={isLoading}
                                    className={`${!hasText ? 'bg-gray-300 dark:bg-zinc-700' : ''}`}
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
