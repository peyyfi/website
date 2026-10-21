import Image from "next/image";
import { WaitlistForm } from "./waitlist-form";
import { WalletPreview } from "../components/WalletPreview";

export default function Home() {
  return (
    <main className="waitlist-page">
      <header className="site-header">
        <div className="brand-lockup" aria-label="Peyyfi"><Image className="brand-symbol" data-header-logo src="/peyyfi-mark.svg" alt="" width={38} height={38} preload /><span>Peyyfi</span></div>
        <span className="launch-label"><span />Early access</span>
      </header>
      <section className="hero" aria-labelledby="waitlist-heading">
        <div className="hero-copy">
          <p className="eyebrow">Your everyday stablecoin wallet</p>
          <h1 id="waitlist-heading">Your money,<br /><span>made simple.</span></h1>
          <p className="hero-description">Hold USDC and USDT, send money, and spend with virtual cards. One wallet for your everyday.</p>
          <WaitlistForm />
          <ul className="feature-list" aria-label="Peyyfi features"><li>One wallet</li><li>Easy transfers</li><li>Virtual cards</li></ul>
        </div>
        <WalletPreview />
      </section>
      <footer className="site-footer"><span>© {new Date().getFullYear()} Peyyfi</span><span>Money in motion. Life in focus.</span></footer>
    </main>
  );
}
