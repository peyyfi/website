"use client";

import { useState } from "react";
import { SplashScreen } from "@/components/SplashScreen";
import { MaintenanceScreen } from "@/components/MaintenanceScreen";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const isMaintenanceMode = true; // toggle this flag or pull from an env/API

  return (
      <>
        {showSplash && (
            <SplashScreen onAnimationComplete={() => setShowSplash(false)} />
        )}

        {!showSplash && isMaintenanceMode && <MaintenanceScreen />}

        {!showSplash && !isMaintenanceMode && (
            <main style={{ padding: 40, color: "#fff", background: "#000", minHeight: "100vh" }}>
              <h1>Welcome to Peyyfi</h1>
            </main>
        )}
      </>
  );
}