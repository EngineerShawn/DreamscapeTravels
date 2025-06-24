import React from "react";

const travelServices = [
    { title: "Cruises", icon: "🚢" },
    { title: "Family Vacations", icon: "👨‍👩‍👧‍👦" },
    { title: "Solo Travelers", icon: "🚶‍♂️" },
    { title: "Couples Getaways", icon: "💕" },
    { title: "Adventure Expeditions", icon: "🏞️" },
    { title: "All-Inclusive Resorts", icon: "🍹" },
];

export default function ServicesSection() {
    return (
        <section id="services" className="py-16 text-center">
            <h2 className="text-3xl font-bold font-serif mb-2 text-gray-900 dark:text-white">A World Travel Guide You Can Trust</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">From romantic getaways and solo escapes to luxury cruises and family vacations, we&apos;ve got you covered.</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {travelServices.map(service => (
                    <div key={service.title} className="flex flex-col items-center p-4 bg-white dark:bg-zinc-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                        <div className="text-4xl mb-3">{service.icon}</div>
                        <h3 className="font-semibold text-gray-800 dark:text-gray-100">{service.title}</h3>
                    </div>
                ))}
            </div>
        </section>
    );
}