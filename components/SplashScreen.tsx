"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const splashRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const splash = splashRef.current;
    const logo = logoRef.current;
    if (!splash || !logo) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const animations: Animation[] = [];
    let timer: number | undefined;
    const finish = () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", finish);
      motion.removeEventListener("change", finish);
      setVisible(false);
    };

    if (motion.matches || typeof logo.animate !== "function") {
      finish();
      return;
    }

    timer = window.setTimeout(() => {
      const target = document.querySelector<HTMLElement>("[data-header-logo]");
      if (!target) { finish(); return; }

      // Measure both ends so the same logo lands precisely in the responsive header.
      const from = logo.getBoundingClientRect();
      const to = target.getBoundingClientRect();
      const x = to.x + to.width / 2 - from.x - from.width / 2;
      const y = to.y + to.height / 2 - from.y - from.height / 2;
      const options: KeyframeAnimationOptions = {
        duration: 480,
        easing: "cubic-bezier(0.22, 0.61, 0.36, 1)",
        fill: "forwards",
      };
      animations.push(logo.animate([
        { transform: "translate3d(0, 0, 0) scale(1)" },
        { transform: `translate3d(${x}px, ${y}px, 0) scale(${to.width / from.width})` },
      ], options));

      const fade = (selector: string, opacity: number[]) => {
        const element = splash.querySelector<HTMLElement>(selector);
        if (element) animations.push(element.animate(
          opacity.map((value) => ({ opacity: value })), options,
        ));
      };
      fade(".splash-backdrop", [1, 0]);
      fade(".splash-name", [1, 0, 0]);
      fade(".splash-mark-light", [1, 0]);
      fade(".splash-mark-brand", [0, 1]);
      void Promise.all(animations.map((animation) => animation.finished)).then(finish, () => {});
    }, 400);

    window.addEventListener("resize", finish, { once: true });
    motion.addEventListener("change", finish, { once: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("resize", finish);
      motion.removeEventListener("change", finish);
      animations.forEach((animation) => animation.cancel());
    };
  }, []);

  if (!visible) return null;

  return (
    <div ref={splashRef} className="site-splash" aria-hidden="true" data-testid="site-splash">
      <div className="splash-backdrop" />
      <div className="splash-lockup">
        <div ref={logoRef} className="splash-logo">
          <Image className="splash-mark-light" src="/peyyfi-mark-reverse.svg" alt="" width={88} height={88} preload />
          <Image className="splash-mark-brand" src="/peyyfi-mark.svg" alt="" width={88} height={88} preload />
        </div>
        <span className="splash-name">Peyyfi</span>
      </div>
    </div>
  );
}
