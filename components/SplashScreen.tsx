"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function SplashScreen() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 1100);
    return () => window.clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div className="site-splash" aria-hidden="true" data-testid="site-splash">
      <div className="splash-lockup">
        <Image src="/peyyfi-mark-reverse.svg" alt="" width={88} height={88} preload />
        <span>Peyyfi</span>
      </div>
    </div>
  );
}
