'use client';
import React from "react";
import { Card, CardHeader, Image } from "@nextui-org/react";
import { destinations } from "@/data/destinations";
import NextLink from 'next/link';

export default function FeaturedDestinations() {
    // Show only the first 4 for the homepage from the central data file
    const featured = destinations.slice(0, 4);

    return (
        <section id="destinations" className="py-16 text-center">
            <h2 className="text-3xl font-bold font-serif mb-2 text-gray-900 dark:text-white">Featured Destinations</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">Get inspired for your next adventure. Where do you want to go?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featured.map((dest) => (
                    <NextLink key={dest.slug} href={`/destinations/${dest.slug}`} passHref>
                        <Card isPressable className="h-[300px] relative overflow-hidden rounded-lg shadow-lg transition-transform transform hover:scale-105">
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
                    </NextLink>
                ))}
            </div>
        </section>
    );
}