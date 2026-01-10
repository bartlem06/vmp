import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VMP Piotr Lemieszek | Business Advisory Services",
  description:
    "VMP Partners is a Warsaw-based financial advisory boutique focused on renewable energy, energy transition, water, and agriculture projects.",
  openGraph: {
    title: "VMP Piotr Lemieszek | Business Advisory Services",
    description:
      "Specializing in structured financing, capital sourcing and advisory work across Europe and developing markets.",
    url: "https://www.vmpartners.pl",
    siteName: "VMP Piotr Lemieszek",
    locale: "pl_PL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VMP Piotr Lemieszek | Business Advisory Services",
    description:
      "European-based advisory services for sustainable energy and infrastructure capital sourcing.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
