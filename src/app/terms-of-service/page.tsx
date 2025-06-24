/* eslint-disable @typescript-eslint/ban-ts-comment */
import AppNavbar from "@/components/AppNavbar";
import AppFooter from "@/components/AppFooter";

export default function TermsOfServicePage() {
    return (
        <div className="min-h-screen bg-gray-50 dark:bg-zinc-900 flex flex-col">
            {/* @ts-ignore */}
            <AppNavbar />
            <main className="flex-grow max-w-4xl mx-auto p-8 text-gray-800 dark:text-gray-200">
                <h1 className="text-4xl font-bold font-serif mb-6">Terms of Service</h1>

                <section className="mb-6">
                    <h2 className="text-2xl font-semibold font-serif mb-2">1. Agreement to Terms</h2>
                    <p>By using our services, you agree to be bound by these Terms. If you don’t agree to be bound by these Terms, do not use the services. These terms govern your access to and use of our website, products, and services ("Products"). Please read these Terms carefully, and contact us if you have any questions.</p>
                </section>

                <section className="mb-6">
                    <h2 className="text-2xl font-semibold font-serif mb-2">2. Using Our Services</h2>
                    <p>You may use our Services only if you can form a binding contract with Dreamscape Travels, and only in compliance with these Terms and all applicable laws. When you create your Dreamscape Travels account, you must provide us with accurate and complete information. Any use or access by anyone under the age of 13 is prohibited.</p>
                </section>

                <section className="mb-6">
                    <h2 className="text-2xl font-semibold font-serif mb-2">3. Limitation of Liability</h2>
                    <p>TO THE MAXIMUM EXTENT PERMITTED BY LAW, DREAMSCAPE TRAVELS SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM (A) YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICES; (B) ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICES...</p>
                </section>

                {/* Add more sections as needed */}
            </main>
            <AppFooter />
        </div>
    );
}
