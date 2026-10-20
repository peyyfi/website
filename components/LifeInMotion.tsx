"use client";

import { useEffect, useState } from "react";

const moments = [
  { label: "People", note: "A little love, sent.", title: "Closer to your people.", description: "Because taking care of each other matters." },
  { label: "Dreams", note: "Small steps. Big dreams.", title: "Room for your next dream.", description: "For the little things that become big things." },
  { label: "Freedom", note: "Oh, the places you’ll go.", title: "More life. Less limits.", description: "A little more freedom to do your thing." },
];

export function LifeInMotion() {
  const [moment, setMoment] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setInterval> | undefined;
    const update = () => {
      clearInterval(timer);
      if (!paused && !preference.matches) {
        timer = setInterval(() => setMoment((current) => (current + 1) % moments.length), 6500);
      }
    };
    update();
    preference.addEventListener("change", update);
    return () => {
      clearInterval(timer);
      preference.removeEventListener("change", update);
    };
  }, [paused, moment]);

  const current = moments[moment];

  return (
    <div className="life-stage" data-paused={paused}>
      <div className="life-art" aria-hidden="true">
        <div className="life-halo" />
        <svg className="life-illustration" viewBox="0 0 480 430" fill="none">
          <defs>
            <radialGradient id="life-orange" cx=".32" cy=".22" r=".85">
              <stop stopColor="#ff9860" /><stop offset=".58" stopColor="#fc4c02" /><stop offset="1" stopColor="#e74400" />
            </radialGradient>
            <linearGradient id="life-peach" x1="260" y1="210" x2="360" y2="350" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ffe3c8" /><stop offset="1" stopColor="#ffb88b" />
            </linearGradient>
          </defs>
          <ellipse className="life-ground" cx="245" cy="365" rx="133" ry="15" fill="#a64b20" opacity=".09" />
          <ellipse cx="245" cy="228" rx="192" ry="149" transform="rotate(-28 245 228)" stroke="#c9b9ae" strokeDasharray="3 9" strokeLinecap="round" opacity=".6" />
          <g className="life-sparkle" stroke="#fc4c02" strokeWidth="2" strokeLinecap="round">
            <path d="M91 168v20m-10-10h20M386 288v14m-7-7h14" />
            <path d="m356 102 3 8 8 3-8 3-3 8-3-8-8-3 8-3Z" fill="#fc4c02" stroke="none" />
          </g>
          <circle className="life-dot" cx="109" cy="310" r="5" fill="#f7b28b" />
          <circle className="life-dot life-dot-late" cx="396" cy="188" r="4" fill="#fc4c02" />
          <g className="life-character">
            <path d="M128 264c-30 3-43-13-43-32" stroke="#e94a0a" strokeWidth="13" strokeLinecap="round" />
            <path className="life-wave" d="M284 250c32-2 43-25 39-46" stroke="#e94a0a" strokeWidth="13" strokeLinecap="round" />
            <path d="m177 325-8 22m66-22 8 22" stroke="#c83c00" strokeWidth="14" strokeLinecap="round" />
            <path d="M117 255c-4-57 27-106 86-108 63-2 99 42 99 102 0 60-31 94-91 94-57 0-90-30-94-88Z" fill="url(#life-orange)" />
            <g className="life-eyes" fill="#542408">
              <ellipse cx="176" cy="237" rx="5.5" ry="9" /><ellipse cx="229" cy="237" rx="5.5" ry="9" />
            </g>
            <ellipse cx="156" cy="260" rx="13" ry="7" fill="#ffb083" opacity=".65" />
            <ellipse cx="248" cy="260" rx="13" ry="7" fill="#ffb083" opacity=".65" />
            <path d="M186 260q17 22 34 0" stroke="#542408" strokeWidth="4.5" strokeLinecap="round" />
            <path d="M144 202c5-15 15-25 30-30" stroke="#ffbb91" strokeWidth="7" strokeLinecap="round" opacity=".5" />
          </g>
          <g key={moment} className="life-moment">
            {moment === 0 ? <>
              <g className="life-companion">
                <path d="m294 332-3 17m45-17 5 17" stroke="#e99c6e" strokeWidth="11" strokeLinecap="round" />
                <path d="M256 284c0-39 22-66 59-66 39 0 62 28 62 67 0 40-21 62-60 62-38 0-61-23-61-63Z" fill="url(#life-peach)" />
                <path d="M280 279q6-10 12 0m31 0q6-10 12 0m-38 19q11 13 23-1" stroke="#743c24" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M268 307c-23 9-39 4-50-9" stroke="#ffbd94" strokeWidth="12" strokeLinecap="round" />
                <ellipse cx="279" cy="295" rx="9" ry="5" fill="#f09b80" opacity=".6" />
                <ellipse cx="343" cy="295" rx="9" ry="5" fill="#f09b80" opacity=".6" />
              </g>
              <path className="life-heart" d="M291 159s-37-22-37-43c0-19 25-26 37-9 12-17 37-10 37 9 0 21-37 43-37 43Z" fill="#fc4c02" />
            </> : moment === 1 ? <>
              <g className="life-dream">
                <path d="m319 112 18 37 41 6-30 29 7 41-36-19-36 19 7-41-30-29 41-6Z" fill="#ffc76c" stroke="#f7b44d" strokeWidth="2" strokeLinejoin="round" />
                <path d="M307 170v5m23-5v5m-21 10q9 8 17 0" stroke="#7e4c14" strokeWidth="3.5" strokeLinecap="round" />
              </g>
              <path d="m306 296 9-17 10 17 19 3-14 14 3 19-18-9-17 9 3-19-14-14Z" fill="#ffe1a7" />
              <path d="m368 251 4-9 5 9 10 2-7 7 1 10-9-5-9 5 2-10-7-7Z" fill="#fc4c02" />
            </> : <>
              <g className="life-plane">
                <path d="m267 162 111-54-35 111-27-35-49-22Z" fill="#fffaf3" stroke="#d6baa6" strokeWidth="2" strokeLinejoin="round" />
                <path d="m316 184 62-76-45 89-17-13Z" fill="#ffd0ad" />
                <path d="m316 184-4 28 21-15" fill="#f6b587" />
              </g>
              <path d="M313 233c43 28 62 69 32 83-28 12-42-21-20-25 23-4 32 51-18 54" stroke="#d5aa8b" strokeWidth="2" strokeDasharray="4 7" strokeLinecap="round" />
            </>}
          </g>
        </svg>
        <div className="life-note" key={current.note}><span className="life-note-dot" />{current.note}</div>
        <span className="life-handwritten">a little more life.</span>
      </div>
      <div className="life-caption">
        <p className="life-kicker">MONEY IN MOTION. LIFE IN FOCUS.</p>
        <div className="life-caption-text" key={current.title}>
          <h2>{current.title}</h2>
          <p>{current.description}</p>
        </div>
        <div className="life-controls">
          <div className="life-moments" role="group" aria-label="Explore life with Peyyfi">
            {moments.map((item, index) => (
              <button type="button" key={item.label} aria-pressed={moment === index} onClick={() => setMoment(index)}>{item.label}</button>
            ))}
          </div>
          <button className="life-pause" type="button" aria-label={paused ? "Play animation" : "Pause animation"} onClick={() => setPaused(!paused)}>
            <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">{paused ? <path d="m5 3 8 5-8 5Z" /> : <path d="M4 3h3v10H4zm5 0h3v10H9z" />}</svg>
          </button>
        </div>
      </div>
    </div>
  );
}
