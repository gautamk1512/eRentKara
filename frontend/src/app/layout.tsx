import type { Metadata } from "next";
import "./globals.css";
import "./premium.css";
import AgreementChrome from "@/components/AgreementChrome";
import PremiumExperience from "@/components/PremiumExperience";
import { LanguageProvider } from "@/context/LanguageContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "eRentKarar — Rental agreements, simplified",
  description: "Submit your rental details and documents. Track verification, local agreement preparation and soft or hard copy delivery in one place.",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.svg",
    shortcut: "/icon.svg",
  },
};

import Script from "next/script";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "try{document.documentElement.dataset.theme=localStorage.getItem('erk_theme')==='dark'?'dark':'light'}catch(e){}" }} />
        <link rel="preconnect" href="https://images.unsplash.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://tile.openstreetmap.org" />
        <link rel="dns-prefetch" href="https://tile.openstreetmap.org" />
      </head>
      <body className="min-h-screen flex flex-col bg-white text-[#1d1d1f] overflow-x-hidden max-w-[100vw]">
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />
        <LanguageProvider>
          <ThemeProvider><Suspense><PremiumExperience><AgreementChrome>{children}</AgreementChrome></PremiumExperience></Suspense></ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
