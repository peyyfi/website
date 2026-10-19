import Image from "next/image";
import { WaitlistForm } from "./waitlist-form";

function WalletPreview() {
  return (
    <div className="app-preview">
      <Image
        className="preview-home-screen"
        src="/peyyfi-home-screen.png"
        alt="Peyyfi mobile Home screen showing the wallet balance, Add money and Transfer actions, virtual card, and recent transactions."
        width={856}
        height={1856}
        sizes="(max-width: 420px) 288px, (max-width: 760px) 296px, (max-width: 1020px) 288px, 312px"
        preload
      />
    </div>
  );
}

export default function Home() {
  return (
    <main className="waitlist-page">
      <header className="site-header">
        <div className="brand-lockup" aria-label="Peyyfi"><Image className="brand-symbol" data-header-logo src="/peyyfi-mark.svg" alt="" width={38} height={38} preload /><span>Peyyfi</span></div>
        <span className="launch-label"><span />Early access</span>
      </header>
      <section className="hero" aria-labelledby="waitlist-heading">
        <div className="hero-copy">
          <p className="eyebrow"><span />Money, made simple</p>
          <h1 id="waitlist-heading">Your money,<br /><span>made simple.</span></h1>
          <p className="hero-description">Your wallet, stablecoins, and virtual cards—all in one place. A simpler way to move and manage your money is coming.</p>
          <WaitlistForm />
          <p className="form-note">Be first in line. Product updates only, no noise.</p>
          <div className="feature-list" aria-label="Peyyfi features"><span>One wallet</span><span>Easy transfers</span><span>Virtual cards</span></div>
        </div>
        <div className="preview-stage"><div className="preview-backdrop" aria-hidden="true" /><WalletPreview /><div className="preview-caption"><Image src="/peyyfi-mark.svg" alt="" width={23} height={23} /><span>A little preview of what&apos;s next.</span></div></div>
      </section>
      <footer className="site-footer"><span>© {new Date().getFullYear()} Peyyfi</span><span>Money in motion. Life in focus.</span></footer>
    </main>
  );
}
