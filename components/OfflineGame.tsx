"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import "./OfflineGame.css";

function subscribe(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

export function OfflineGame() {
  const online = useSyncExternalStore(subscribe, () => navigator.onLine, () => true);
  const dialog = useRef<HTMLDialogElement>(null);
  const gameFrame = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      void navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" })
        .catch(() => { /* The loaded game still works if offline caching is unavailable. */ });
    }
  }, []);

  useEffect(() => {
    if (!online && !dialog.current?.open) dialog.current?.showModal();
  }, [online]);

  useEffect(() => {
    const frame = gameFrame.current;
    if (!frame) return;
    let observer: ResizeObserver | undefined;
    const fitGame = () => {
      observer?.disconnect();
      const body = frame.contentDocument?.body;
      if (!body) return;
      const resize = () => { frame.style.height = `${Math.ceil(body.getBoundingClientRect().height)}px`; };
      observer = new ResizeObserver(resize);
      observer.observe(body);
      resize();
    };
    frame.addEventListener("load", fitGame);
    fitGame();
    return () => {
      observer?.disconnect();
      frame.removeEventListener("load", fitGame);
    };
  }, []);

  return (
    <dialog ref={dialog} className="offline-dialog" aria-labelledby="offline-title">
      <div className="offline-dialog-header">
        <div>
          <h2 id="offline-title">{online ? "You’re back online" : "You’re offline"}</h2>
          <p role="status">{online ? "Your connection is back. Finish your run or return to the waitlist." : "Take a little play break while your connection returns."}</p>
        </div>
        <button type="button" onClick={() => dialog.current?.close()}>Return to waitlist</button>
      </div>
      <iframe ref={gameFrame} src="/offline.html" title="Peyyfi Jump offline game" className="offline-game-frame" />
    </dialog>
  );
}
