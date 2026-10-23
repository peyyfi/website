"use client";

import Image from "next/image";
import type { MouseEvent } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";

export function HomeScreenPreview() {
  function focusWaitlist(event: MouseEvent<HTMLAnchorElement>) {
    const input = document.querySelector(".waitlist-form input:not(.honeypot)");
    if (input instanceof HTMLInputElement && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
      event.preventDefault();
      document.getElementById("join-waitlist")?.scrollIntoView({ block: "start" });
      input.focus({ preventScroll: true });
    }
  }

  return (
    <section id="right-at-home" className="home-screen-preview" aria-labelledby="home-screen-heading">
      <p className="eyebrow">A little space. Everyday possibility.</p>
      <h2 id="home-screen-heading">Right at home.</h2>
      <p className="home-screen-description">Peyyfi, alongside your everyday essentials.</p>
      <figure className="home-screen-figure">
        <Image
          className="home-screen-image"
          src="/images/peyyfi-home-screen.png"
          alt="A phone home screen with the orange Peyyfi app icon among blank gray app tiles."
          width={1070}
          height={1470}
          sizes="(max-width: 480px) 420px, 480px"
        />
      </figure>
      <div className="home-screen-footer">
        <a className="home-screen-link" href="#join-waitlist" onClick={focusWaitlist}>
          Join the waitlist
          <HugeiconsIcon icon={ArrowRight01Icon} size={18} strokeWidth={1.8} aria-hidden="true" />
        </a>
        <p>iOS &amp; Android · Coming soon</p>
      </div>
    </section>
  );
}
