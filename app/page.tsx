import Image from "next/image";
import Link from "next/link";
import { SpaceDots } from "../components/SpaceDots";
import { WaitlistForm } from "./waitlist-form";
import { HomeScreenPreview } from "../components/HomeScreenPreview";
import { ScrollReveals } from "../components/ScrollReveals";
import { site } from "../lib/site";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${site.url}#organization`,
      name: site.name,
      url: site.url,
      description: site.description,
      logo: {
        "@type": "ImageObject",
        url: new URL(site.logo, site.url).href,
        width: 1024,
        height: 1024,
      },
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}#website`,
      name: site.name,
      url: site.url,
      inLanguage: "en",
      description: site.description,
      publisher: { "@id": `${site.url}#organization` },
    },
  ],
};

export default function Home() {
  return (
    <main className="waitlist-page">
      <ScrollReveals />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
      <header className="site-header">
        <Link className="brand-lockup" href="/" aria-label="Peyyfi home"><Image className="brand-symbol" data-header-logo src="/peyyfi-mark-reverse.svg" alt="" width={38} height={38} preload /><span>Peyyfi</span></Link>
        <span className="launch-label"><span />Early access</span>
      </header>
      <section className="hero hero-copy-only" aria-labelledby="waitlist-heading">
        <SpaceDots className="hero-dots" fine />
        <div className="hero-copy">
          <p className="eyebrow">Your everyday USDC &amp; USDT wallet</p>
          <h1 id="waitlist-heading" data-hero-reveal="headline">Your money,<br /><span>made simple.</span></h1>
          <p className="hero-description" data-hero-reveal="description">A stablecoin wallet for holding USDC and USDT, sending money and spending with virtual cards. Join the waitlist for early access to Peyyfi.</p>
          <div id="join-waitlist" className="waitlist-anchor" data-hero-reveal="form"><WaitlistForm /></div>
          <ul className="feature-list" aria-label="Peyyfi features"><li>One wallet</li><li>Easy transfers</li><li>Virtual cards</li></ul>
        </div>
      </section>
      <HomeScreenPreview />
      <section className="product-details" aria-labelledby="product-heading">
        <p className="eyebrow" data-scroll-reveal="">Meet Peyyfi</p>
        <h2 id="product-heading" data-scroll-reveal="">Stablecoins, transfers and virtual cards.<br />Together in one wallet.</h2>
        <div className="product-grid">
          <article data-scroll-reveal=""><h3>A wallet for USDC and USDT</h3><p>Peyyfi is being built to help you hold and manage your stablecoins in one place, with a clear view of your balances.</p></article>
          <article data-scroll-reveal=""><h3>Send money simply</h3><p>Keep transfers and transaction activity together, so you can follow where your money goes from the same wallet.</p></article>
          <article data-scroll-reveal=""><h3>Virtual cards for everyday spending</h3><p>Manage your wallet and virtual cards in one app. Join the waitlist to hear more as Peyyfi gets ready to launch.</p></article>
        </div>
      </section>
      <section className="waitlist-faq" aria-labelledby="faq-heading" data-scroll-reveal="">
        <h2 id="faq-heading">Before you join</h2>
        <details><summary>What is Peyyfi?</summary><p>Peyyfi is an upcoming stablecoin wallet bringing USDC, USDT, transfers and virtual cards into one app.</p></details>
        <details><summary>Is the Peyyfi app available yet?</summary><p>This page is for the early-access waitlist. Leave your email address or phone number and we’ll keep you informed about product updates and launch news.</p></details>
        <details><summary>How do I join the waitlist?</summary><p>Enter your email address or phone number in the form above and select “Join the waitlist”. For phone signups, Ghana (+233) is selected by default and you can choose another country. You’ll see a confirmation once your signup is saved.</p></details>
      </section>
      <footer className="site-footer"><span>© {new Date().getFullYear()} Peyyfi</span><span>Money in motion. Life in focus.</span></footer>
    </main>
  );
}
