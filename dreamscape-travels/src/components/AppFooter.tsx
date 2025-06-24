import React from "react";

export default function AppFooter() {
    return (
        <footer className="bg-gray-800 dark:bg-zinc-950">
            <div className="max-w-6xl mx-auto py-8 px-4 md:px-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left">
                <div>
                    <p className="font-bold font-serif text-lg text-white">Dreamscape <span className="text-primary">Travels</span></p>
                    <p className="text-gray-400 dark:text-gray-300 text-sm">Copyright &copy; {new Date().getFullYear()} | All Rights Reserved | Designed by Lydia Webster</p>
                    <p className="text-gray-400 dark:text-gray-300 text-sm mt-1"><a href="/privacy-policy" className="hover:underline">Privacy Policy</a> - <a href="/terms-and-conditions" className="hover:underline">Terms & Conditions</a> - <a href="/contact" className="hover:underline">Contact Us</a></p>
                </div>
                <div className="mt-4 md:mt-0">
                    <p className="font-semibold text-white dark:text-gray-100">Tim Perry</p>
                    <p className="text-gray-400 dark:text-gray-300">timothy@dreamsscapetravels.com</p>
                    <p className="text-gray-400 dark:text-gray-300">812-292-2066</p>
                </div>
            </div>
        </footer>
    );
}
