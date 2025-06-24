'use client';
import React from "react";
import { Card, CardHeader, CardBody, CardFooter, Avatar, Divider } from "@nextui-org/react";

export default function AboutSection() {
    return (
        <section id="about" className="py-16">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 bg-white dark:bg-zinc-800 p-8 rounded-2xl shadow-lg">
                <Card className="max-w-[400px] shadow-xl">
                    <CardHeader className="justify-between">
                        <div className="flex gap-5 items-center">
                            <Avatar isBordered radius="full" size="lg" src="https://imgur.com/II44Aun.png" />
                            <div className="flex flex-col gap-1 items-start justify-center">
                                <h4 className="text-lg font-semibold leading-none text-default-600">Tim Perry</h4>
                                <h5 className="text-sm tracking-tight text-default-400">Your Personal Escape Planner</h5>
                            </div>
                        </div>
                    </CardHeader>
                    <CardBody className="px-3 py-0 text-sm text-default-500">
                        <p>
                            Hi, I&apos;m Tim Perry! Whether you&apos;re dreaming of a relaxing beach retreat, a thrilling adventure, or a once-in-a-lifetime group getaway, I&apos;m here to bring your perfect trip to life—without the stress.
                        </p>
                    </CardBody>
                    <CardFooter className="gap-3">
                        <div className="flex flex-col w-full text-sm text-default-500">
                            <Divider className="my-2" />
                            <div className="flex items-center gap-2 mt-2">
                                <svg xmlns="https://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.75 1.75 0 0 1-1.657-.459L5.482 8.062a1.75 1.75 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58zM1.884.511a1.745 1.745 0 0 1 2.612.163L6.29 2.98c.329.423.445.974.315 1.494l-.547 2.19a.68.68 0 0 0 .178.643l2.457 2.457a.68.68 0 0 0 .644.178l2.189-.547a1.75 1.75 0 0 1 1.494.315l2.306 1.794c.829.645.905 1.87.163 2.611l-1.034 1.034c-.74.74-1.846 1.065-2.877.702a18.6 18.6 0 0 1-7.01-4.42 18.6 18.6 0 0 1-4.42-7.009c-.362-1.03-.037-2.137.703-2.877z" /></svg>
                                <span>812-292-2066</span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                                <svg xmlns="https://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414zM0 4.697v7.104l5.803-3.558zM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586zm3.436-.586L16 11.801V4.697z" /></svg>
                                <span>timothy@dreamscapetravels.com</span>
                            </div>
                        </div>
                    </CardFooter>
                </Card>
                <div className="md:w-1/2">
                    <h2 className="text-3xl font-bold font-serif mb-4 text-gray-900 dark:text-white">Our Specialty is Escape</h2>
                    <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">I believe travel should be exciting, seamless, and tailored for you. From family vacations and solo escapes to romantic getaways and luxury cruises, I handle every detail so you can focus on making unforgettable memories.</p>
                    <p className="text-gray-600 dark:text-gray-300 text-lg">Whether you&apos;re dreaming of a beachside retreat or a whirlwind European tour—we&apos;ve got you.</p>
                </div>
            </div>
        </section>
    );
}