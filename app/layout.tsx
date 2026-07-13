import type { Metadata } from "next";
import { Instrument_Serif, Hanken_Grotesk, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

// Body / UI / labels — the workhorse humanist sans (Serif-as-Display rule).
const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-sans",
});

// Display / all headings — single-weight (400) roman + italic. Display use only
// (>= ~24px floor; smaller titles fall back to Hanken semibold — see DESIGN.md).
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
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
        hankenGrotesk.variable,
        instrumentSerif.variable,
        geistMono.variable,
        "font-sans"
      )}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
