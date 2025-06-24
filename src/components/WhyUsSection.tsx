/* eslint-disable @next/next/no-img-element */
import React from "react";

const whyChooseUs = [
    "Personalized Service from a Real Person",
    "Stress-Free Planning (Saves 10-20 hours of research)",
    "Expert Handling of Flight Delays & Cancellations",
    "Guidance on Country Regulations & Travel Advisories",
    "Access to Exclusive Deals & No Hidden Fees",
    "Travel Protection & Flexible Payment Plans",
];

export default function WhyUsSection() {
    return (
        <section className="py-16 bg-blue-50/50 dark:bg-blue-950/20 rounded-2xl px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 className="text-3xl font-bold font-serif mb-4 text-gray-900 dark:text-white">Why Work With a Travel Agent?</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">You&apos;re already paying for one—whether you realize it or not. Hotels, cruises, and resorts build agent commissions into their prices. So when you book on your own, you&apos;re paying for a service you don&apos;t receive.</p>
                    <div className="space-y-3">
                        {whyChooseUs.map((item, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span className="text-gray-700 dark:text-gray-300">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="hidden md:block">
                    <img src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop" alt="Travel agent planning" className="rounded-xl shadow-2xl w-full h-full object-cover" />
                </div>
            </div>
        </section>
    );
}
