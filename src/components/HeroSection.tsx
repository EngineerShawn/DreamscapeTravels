/* eslint-disable @next/next/no-img-element */
'use client';
import React from "react";
import { Button } from "@nextui-org/react";

type Props = {
    onOpenModal: () => void;
};

export default function HeroSection({ onOpenModal }: Props) {
    return (
        <header className="relative h-[60vh] md:h-[70vh] flex items-center justify-center text-white text-center px-4">
            <div className="absolute inset-0 bg-black opacity-40 z-10"></div>
            <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop" alt="Beautiful travel destination" className="absolute inset-0 w-full h-full object-cover" />
            <div className="relative z-20 max-w-3xl">
                <h1 className="text-4xl md:text-6xl font-extrabold font-serif leading-tight tracking-tight drop-shadow-sm">Your Personal Escape Planner</h1>
                <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">
                    I handle every detail so you can focus on making unforgettable memories. Travel should be exciting, seamless, and tailored for you.
                </p>
                <Button onPress={onOpenModal} color="primary" size="lg" className="mt-8 font-bold text-lg">
                    Start Planning Your Dream Trip
                </Button>
            </div>
        </header>
    );
}
