import type { Metadata } from "next";
import localFont from "next/font/local";

import "./globals.css";

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
  title: "Peyyfi — Join the waitlist",
  description:
    "Join the Peyyfi waitlist for early access to a beautifully simple way to move and manage money.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={spaceGrotesk.variable}>
      <body>{children}</body>
    </html>
  );
}
