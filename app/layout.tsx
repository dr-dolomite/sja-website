import type { Metadata } from "next";
import { Sora, Marcellus, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sans",
});

const marcellus = Marcellus({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-serif",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "St. Joseph's Academy of Malinao | Where Guardians Grow",
  description:
    "St. Joseph's Academy of Malinao, Inc. is a private Catholic (Diocesan) school in Malinao, Aklan, Philippines, forming Guardians in faith, knowledge, and virtue since 1947.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        sora.variable,
        marcellus.variable,
        geistMono.variable,
        "font-sans"
      )}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
