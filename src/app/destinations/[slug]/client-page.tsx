'use client';

import React from "react";
import AppNavbar from "@/components/AppNavbar";
import AppFooter from "@/components/AppFooter";
import ConsultationModal from "@/components/ConsultationModal";
import AiChatbot from "@/components/AiChatbot";
import { Image, Card, CardBody } from "@nextui-org/react";
import type { destinations } from "@/data/destinations";

type Destination = (typeof destinations)[0];

type DestinationClientPageProps = {
    destination: Destination;
};

export default function DestinationClientPage({ destination }: DestinationClientPageProps) {
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => setIsModalOpen(false);

    return (
        <>
            <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
                <AppNavbar onOpenModal={handleOpenModal} />
                <header className="relative h-[50vh]">
                    <Image
                        src={destination.image}
                        alt={`Hero image for ${destination.name}`}
                        removeWrapper
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <h1 className="text-5xl md:text-7xl font-bold font-serif text-white text-center shadow-lg">{destination.name}</h1>
                    </div>
                </header>

                <main className="max-w-4xl mx-auto p-4 md:p-8">
                    <section className="mb-12">
                        <h2 className="text-3xl font-bold font-serif mb-4 text-gray-900 dark:text-white">About {destination.name.split(',')[0]}</h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">{destination.description}</p>
                    </section>

                    <section className="mb-12">
                        <h2 className="text-3xl font-bold font-serif mb-6 text-gray-900 dark:text-white">Top Activities</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {destination.topActivities.map(activity => (
                                <div key={activity.name} className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-800 rounded-lg shadow-sm">
                                    <span className="text-3xl">{activity.icon}</span>
                                    <span className="font-semibold text-gray-700 dark:text-gray-200">{activity.name}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-3xl font-bold font-serif mb-6 text-gray-900 dark:text-white">Hotel Spotlight</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {destination.hotelSpotlight.map(hotel => (
                                <Card key={hotel.name} className="h-full">
                                    <CardBody className="p-0">
                                        <Image
                                            src={hotel.image}
                                            alt={`Image of ${hotel.name}`}
                                            width="100%"
                                            height={200}
                                            className="w-full object-cover h-[200px]"
                                        />
                                        <div className="p-4">
                                            <h3 className="text-xl font-bold text-gray-800 dark:text-white">{hotel.name}</h3>
                                            <p className="text-gray-600 dark:text-gray-300 mt-2">{hotel.description}</p>
                                        </div>
                                    </CardBody>
                                </Card>
                            ))}
                        </div>
                    </section>
                </main>
                <AppFooter />
            </div>
            <AiChatbot />
            <ConsultationModal isOpen={isModalOpen} onClose={handleCloseModal} />
        </>
    );
}
