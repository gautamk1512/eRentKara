import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import EkrarAIFloatingChat from "@/components/EkrarAIFloatingChat";
import BetaNoticeModal from "@/components/BetaNoticeModal";
import TrackAgreementModal from "@/components/TrackAgreementModal";
import PromoBanner from "@/components/PromoBanner";
import { LanguageProvider } from "@/context/LanguageContext";

export const metadata: Metadata = {
  title: "eRentKarar — India's Smart Rental Management & Property Marketplace",
  description: "Manage properties, find tenants, collect rent online, and execute state-compliant rental agreements with eSign. Designed for Indian landlords, PGs, hostels, and tenants.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.svg",
    shortcut: "/icon.svg",
  },
};

import GlobalDemoModalWrapper from "@/components/GlobalDemoModalWrapper";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://tile.openstreetmap.org" />
        <link rel="dns-prefetch" href="https://tile.openstreetmap.org" />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-[#1d1d1f] overflow-x-hidden max-w-[100vw]">
        <LanguageProvider>
          <PromoBanner />
          <Navbar />
          <main className="flex-1 overflow-x-hidden">{children}</main>
          <Footer />
          <EkrarAIFloatingChat />
          <BetaNoticeModal />
          <TrackAgreementModal />
          <GlobalDemoModalWrapper />
        </LanguageProvider>
      </body>
    </html>
  );
}
