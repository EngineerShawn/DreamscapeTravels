'use client';
import React from "react";
import NextLink from "next/link";
import AppNavbar from "@/components/AppNavbar";
import AppFooter from "@/components/AppFooter";
import { destinations } from "@/data/destinations";
import { Card, CardHeader, Image } from "@nextui-org/react";
import ConsultationModal from "@/components/ConsultationModal";
import AiChatbot from "@/components/AiChatbot";

export default function DestinationsPage() {
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    return (
        <>
            <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 flex flex-col">
                <AppNavbar onOpenModal={handleOpenModal} />
                <main className="flex-grow max-w-6xl mx-auto p-4 md:p-8">
                    <header className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold font-serif mb-2 text-gray-900 dark:text-white">Our Destinations</h1>
                        <p className="text-lg text-gray-600 dark:text-gray-300">Discover the places we love and recommend.</p>
                    </header>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {destinations.map((dest) => (
                            <NextLink key={dest.slug} href={`/destinations/${dest.slug}`} passHref>
                                <Card isPressable className="h-full">
                                    <Image
                                        removeWrapper
                                        alt={`Image of ${dest.name}`}
                                        className="z-0 w-full h-full object-cover"
                                        src={dest.image}
                                        fallbackSrc="https://placehold.co/400x300/a0aec0/ffffff?text=Image"
                                    />
                                    <CardHeader className="absolute z-10 bottom-0 flex-col !items-start bg-black/40 border-t-1 border-zinc-100/50">
                                        <h4 className="text-white font-medium text-xl">{dest.name.split(',')[0]}</h4>
                                        <p className="text-tiny text-white/80 uppercase font-bold">{dest.name.split(',')[1]}</p>
                                    </CardHeader>
                                </Card>
                            </NextLink>
                        ))}
                    </div>
                </main>
                <AppFooter />
            </div>
            <AiChatbot />
            <ConsultationModal isOpen={isModalOpen} onClose={handleCloseModal} />
        </>
    );
}