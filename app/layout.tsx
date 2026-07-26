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
  title: "Peyyfi | Digital Payments Made Simple",
  description:
      "Peyyfi is a modern fintech platform that enables secure, fast, and convenient digital payments.",

  icons: {
    icon: "/peyyfi.png",
    shortcut: "/peyyfi.png",
    apple: "/peyyfi.png",
  },

  openGraph: {
    title: "Peyyfi | Digital Payments Made Simple",
    description:
        "Secure, fast, and convenient digital payments with Peyyfi.",
    images: [
      {
        url: "/peyyfi.png",
        width: 512,
        height: 512,
        alt: "Peyyfi Logo",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
