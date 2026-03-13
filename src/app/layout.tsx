import type { Metadata } from "next";
import { Inter, Oldenburg } from "next/font/google";
import "./globals.css";
import type { ReactNode } from "react";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap"
});

const oldenburg = Oldenburg({
  subsets: ["latin"],
  variable: "--font-oldenburg",
  display: "swap",
  weight: "400"
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
      <body className={`${inter.variable} ${oldenburg.variable} font-[var(--font-inter)] antialiased`}>
        {children}
      </body>
    </html>
  );
}
