import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";
import { SplashScreen } from "../components/SplashScreen";
import { isPreview, site } from "../lib/site";

const spaceGrotesk = localFont({
  variable: "--font-space-grotesk",
  display: "swap",
  src: [
    { path: "./fonts/SpaceGrotesk-Light.ttf", weight: "300", style: "normal" },
    { path: "./fonts/SpaceGrotesk-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/SpaceGrotesk-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/SpaceGrotesk-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/SpaceGrotesk-Bold.ttf", weight: "700", style: "normal" },
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  applicationName: site.name,
  title: site.title,
  description: site.description,
  alternates: { canonical: "/" },
  verification: {
    google: "0s0W4qJ1RMTNy1eP7L5ft1KKvPlfhF-OfgSPW7Sw3GM",
  },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: site.title,
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: site.title,
    description: site.description,
  },
  robots: {
    index: !isPreview,
    follow: !isPreview,
    googleBot: {
      index: !isPreview,
      follow: !isPreview,
      "max-image-preview": "large",
    },
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={spaceGrotesk.variable} data-scroll-behavior="smooth">
      <body><SplashScreen />{children}</body>
    </html>
  );
}
