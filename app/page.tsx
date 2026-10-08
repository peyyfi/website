import Image from "next/image";

import { WaitlistForm } from "./waitlist-form";

export default function Home() {
  return (
    <main className="waitlist-page">
      <div className="background-grid" aria-hidden="true" />
      <div className="background-glow background-glow-one" aria-hidden="true" />
      <div className="background-glow background-glow-two" aria-hidden="true" />

      <header className="site-header">
        <div className="brand-lockup" aria-label="Peyyfi">
          <span className="brand-wordmark">peyyfi</span>
        </div>

        <div className="launch-label">
          <span aria-hidden="true" />
          Early access
        </div>
      </header>

      <section className="hero" aria-labelledby="waitlist-heading">
        <div className="hero-copy">
          <p className="eyebrow">A new way to move money</p>
          <h1 id="waitlist-heading">
            Your money.
            <br />
            <span>Moving better.</span>
          </h1>
          <p className="hero-description">
            Peyyfi brings everyday payments and digital money together in one
            beautifully simple app. Join the waitlist for early access.
          </p>

          <WaitlistForm />

          <p className="form-note">Product updates only. No noise.</p>
        </div>

        <div className="brand-stage" aria-hidden="true">
          <div className="stage-halo" />
          <div className="stage-orbit stage-orbit-outer" />
          <div className="stage-orbit stage-orbit-inner" />

          <div className="icon-frame">
            <div className="icon-frame-shine" />
            <Image
              className="hero-icon"
              src="/peyyfi-wordmark-icon.png"
              alt=""
              width={1024}
              height={1024}
              priority
            />
          </div>

          <div className="floating-chip floating-chip-top">
            <span className="chip-dot" />
            Built for what&apos;s next
          </div>

          <div className="floating-chip floating-chip-bottom">
            <span>01</span>
            One wallet
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <span>© {new Date().getFullYear()} Peyyfi</span>
        <span>Designed for money in motion.</span>
      </footer>
    </main>
  );
}
