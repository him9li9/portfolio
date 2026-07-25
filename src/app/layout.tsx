import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import localFont from "next/font/local";
import "./globals.css";
import type { ReactNode } from "react";

const interDisplay = localFont({
  src: [
    {
      path: "./fonts/inter-display-400.woff2",
      weight: "400",
      style: "normal"
    },
    {
      path: "./fonts/inter-display-600.woff2",
      weight: "600",
      style: "normal"
    },
    {
      path: "./fonts/inter-display-700.woff2",
      weight: "700",
      style: "normal"
    }
  ],
  variable: "--font-inter",
  display: "swap"
});

const oldenburg = localFont({
  src: "./fonts/oldenburg-400.ttf",
  variable: "--font-oldenburg",
  display: "swap"
});

const title = "Anastasia Ermoshina — Product Designer";
const description =
  "Product Designer with 4+ years of experience in B2B/B2C SaaS, telecom and complex workflows.";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://nastya-ermoshina.vercel.app";
const ogImage = "/og-image.png";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title,
  description,
  openGraph: {
    title,
    description,
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Anastasia Ermoshina — Product Designer"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [ogImage]
  },
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${interDisplay.variable} ${oldenburg.variable} font-[var(--font-inter)] antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
