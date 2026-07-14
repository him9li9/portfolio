import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Nastya Ermoshina Portfolio",
  description: "Product designer and data-driven strategist portfolio",
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
      </body>
    </html>
  );
}
