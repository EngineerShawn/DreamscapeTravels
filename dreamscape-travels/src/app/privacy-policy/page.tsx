/* eslint-disable @typescript-eslint/ban-ts-comment */
'use client';
import AppNavbar from "@/components/AppNavbar";
import AppFooter from "@/components/AppFooter";

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 flex flex-col">
            {/* @ts-ignore */}
            <AppNavbar />
            <main className="flex-grow max-w-4xl mx-auto p-8 text-gray-800 dark:text-gray-200">
                <h1 className="text-4xl font-bold font-serif mb-6">Privacy Policy</h1>

                <section className="mb-6 text-md">
                    <h2 className="text-xl font-semibold font-serif mb-2">1. Introduction</h2>
                    <p>Welcome to Dreamscape Travels. We are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website https://www.dreamscapetravel.com, including any other media form, media channel, mobile website, or mobile application related or connected thereto (collectively, the “Site”). Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.</p>
                </section>

                <section className="mb-6">
                    <h2 className="text-2xl font-semibold font-serif mb-2">2. Collection of Your Information</h2>
                    <p>We may collect information about you in a variety of ways. The information we may collect on the Site includes personally identifiable information, such as your name, shipping address, email address, and telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site, such as online chat and message boards.</p>
                </section>

                <section className="mb-6">
                    <h2 className="text-2xl font-semibold font-serif mb-2">3. Use of Your Information</h2>
                    <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to create and manage your account, email you regarding your account or order, fulfill and manage purchases, orders, payments, and other transactions related to the Site, and request feedback and contact you about your use of the Site.</p>
                </section>

                {/* Add more sections as needed */}

                <section>
                    <h2 className="text-2xl font-semibold font-serif mb-2">Contact Us</h2>
                    <p>If you have questions or comments about this Privacy Policy, please contact us at: timothy@dreamscapetravels.com</p>
                </section>
            </main>
            <AppFooter />
        </div>
    );
}
