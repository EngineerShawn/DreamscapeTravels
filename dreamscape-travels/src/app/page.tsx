'use client';
import React from "react";
import AppNavbar from "@/components/AppNavbar";
import HeroSection from "@/components/HeroSection";
import ServicesSection from "@/components/ServicesSection";
import WhyUsSection from "@/components/WhyUsSection";
import AboutSection from "@/components/AboutSection";
import FeaturedDestinations from "@/components/FeaturedDestinations";
import CtaSection from "@/components/CtaSection";
import AppFooter from "@/components/AppFooter";
import ConsultationModal from "@/components/ConsultationModal";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-900">
        <AppNavbar onOpenModal={handleOpenModal} />
        <HeroSection onOpenModal={handleOpenModal} />
        <main className="max-w-6xl mx-auto p-4 md:p-8">
          <ServicesSection />
          <WhyUsSection />
          <AboutSection />
          <FeaturedDestinations />
          <CtaSection onOpenModal={handleOpenModal} />
        </main>
        <AppFooter />
      </div>
      <ConsultationModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
}
