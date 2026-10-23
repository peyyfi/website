const siteUrl = new URL(process.env.SITE_URL || "https://www.peyyfi.io/");

if (!["http:", "https:"].includes(siteUrl.protocol)) {
  throw new Error("SITE_URL must be an absolute HTTP or HTTPS URL.");
}

export const site = {
  name: "Peyyfi",
  url: `${siteUrl.origin}/`,
  title: "Peyyfi | Stablecoin Wallet & Virtual Cards Waitlist",
  description:
    "Join the Peyyfi waitlist for early access to a USDC and USDT wallet. Manage stablecoins, send money and spend with virtual cards in one app.",
  logo: "/peyyfi-icon.png",
};

export const isPreview = process.env.VERCEL_ENV === "preview";
