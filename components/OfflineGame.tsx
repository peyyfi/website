"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
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
  const [returnIn, setReturnIn] = useState<number | null>(null);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      void navigator.serviceWorker.register("/sw.js", { scope: "/", updateViaCache: "none" })
        .catch(() => { /* The loaded game still works if offline caching is unavailable. */ });
    }
  }, []);

  useEffect(() => {
    if (!online && !dialog.current?.open) {
      dialog.current?.showModal();
      gameFrame.current?.contentWindow?.postMessage({ type: "peyyfi:game-visibility", visible: true }, window.location.origin);
    }
  }, [online]);

  useEffect(() => {
    const popup = dialog.current;
    const receive = (event: MessageEvent) => {
      if (event.origin !== window.location.origin || event.source !== gameFrame.current?.contentWindow) return;
      const data = event.data;
      if (!data || typeof data !== "object") return;
      if (data.type === "peyyfi:return-countdown" &&
        (data.seconds === null || (Number.isInteger(data.seconds) && data.seconds >= 1 && data.seconds <= 10))) {
        setReturnIn(data.seconds);
      }
      if (data.type === "peyyfi:return-home" && navigator.onLine && popup?.open) popup.close();
    };
    const closed = () => {
      // A queued close event can arrive after a rapid disconnect reopens it.
      if (popup?.open) return;
      setReturnIn(null);
      gameFrame.current?.contentWindow?.postMessage({ type: "peyyfi:game-visibility", visible: false }, window.location.origin);
    };
    window.addEventListener("message", receive);
    popup?.addEventListener("close", closed);
    return () => {
      window.removeEventListener("message", receive);
      popup?.removeEventListener("close", closed);
    };
  }, []);

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
      frame.contentWindow?.postMessage({ type: "peyyfi:game-visibility", visible: Boolean(dialog.current?.open) }, window.location.origin);
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
          <p role="status">{online
            ? returnIn !== null ? `Closing the game in ${returnIn} seconds and returning home. Play or choose “Stay here” to keep it open.` : "Your connection is back. Finish your run or return home."
            : "Take a little play break while your connection returns."}</p>
        </div>
        <div className="offline-dialog-actions">
          {online && returnIn !== null && <button type="button" onClick={() => {
            setReturnIn(null);
            gameFrame.current?.contentWindow?.postMessage({ type: "peyyfi:stay" }, window.location.origin);
          }}>Stay here</button>}
          <button type="button" className="offline-return-button" onClick={() => dialog.current?.close()}>
            Return to waitlist
            {online && returnIn !== null && <span className="offline-return-countdown">{returnIn}s</span>}
          </button>
        </div>
      </div>
      <iframe ref={gameFrame} src="/offline.html" title="Peyyfi Jump offline game" className="offline-game-frame" />
    </dialog>
  );
}
