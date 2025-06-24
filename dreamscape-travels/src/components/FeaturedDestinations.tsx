'use client';
import React from "react";
import { Card, CardHeader, Image } from "@nextui-org/react";

const featuredDestinations = [
    { name: "Santorini, Greece", image: "https://plus.unsplash.com/premium_photo-1661964149725-fbf14eabd38c?q=80&w=1170&auto=format&fit=crop" },
    { name: "Kyoto, Japan", image: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?q=80&w=2070&auto=format&fit=crop" },
    { name: "Amalfi Coast, Italy", image: "https://images.unsplash.com/photo-1583844056361-4418a8f2a985?q=80&w=1169&auto=format&fit=crop" },
    { name: "Bali, Indonesia", image: "https://images.unsplash.com/photo-1573790387438-4da905039392?q=80&w=1925&auto=format&fit=crop" }
];

export default function FeaturedDestinations() {
    return (
        <section id="destinations" className="py-16 text-center">
            <h2 className="text-3xl font-bold font-serif mb-2 text-gray-900 dark:text-white">Featured Destinations</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">Get inspired for your next adventure. Where do you want to go?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredDestinations.map((dest) => (
                    <Card key={dest.name} isFooterBlurred className="h-[300px] relative overflow-hidden rounded-lg shadow-lg transition-transform transform hover:scale-105">
                        <CardHeader className="absolute z-10 top-1 flex-col !items-start">
                            <p className="text-tiny text-white/80 uppercase font-bold">{dest.name.split(',')[1]}</p>
                            <h4 className="text-white font-medium text-2xl">{dest.name.split(',')[0]}</h4>
                        </CardHeader>
                        <Image
                            removeWrapper
                            alt={`Image of ${dest.name}`}
                            className="z-0 w-full h-full object-cover"
                            src={dest.image}
                            fallbackSrc="https://placehold.co/400x300/a0aec0/ffffff?text=Image"
                        />
                    </Card>
                ))}
            </div>
        </section>
    );
}