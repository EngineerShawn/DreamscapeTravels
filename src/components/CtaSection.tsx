'use client';
import React from "react";
import { Button } from "@nextui-org/react";

type Props = {
    onOpenModal: () => void;
};

export default function CtaSection({ onOpenModal }: Props) {
    return (
        <section id="contact" className="py-16">
            <div className="bg-primary/10 dark:bg-blue-950/20 text-center p-8 md:p-16 rounded-2xl">
                <h2 className="text-3xl md:text-4xl font-bold font-serif text-primary-800 dark:text-white-300">Let&apos;s Plan Your Next Adventure</h2>
                <p className="text-gray-700 dark:text-gray-300 mt-4 mb-8 max-w-2xl mx-auto">Reach out today and discover the difference a real travel expert can make. Your dream vacation is just a conversation away.</p>
                <Button onPress={onOpenModal} color="primary" size="lg" className="font-bold text-lg">
                    Request a Consultation
                </Button>
            </div>
        </section>
    );
}