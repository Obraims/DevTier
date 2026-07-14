"use client";

import { useEffect, useState } from "react";

const CONTRIBUTORS_URL = "https://github.com/Obraims/DevTier/graphs/contributors";

let cachedCount: number | null = null;

// Footer credit — "Built by @obraims & N amazing contributors". The count is
// fetched (cached) from /api/contributors; until it lands the number is blurred
// and then unblurs with a smooth transition, so the line never changes shape.
// Shared by the home, scout-report and duel footers so they match.
export default function FooterCredit() {
  const [count, setCount] = useState<number | null>(cachedCount);

  useEffect(() => {
    if (cachedCount !== null) return; // already fetched this page load
    fetch("/api/contributors")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d && typeof d.count === "number") {
          cachedCount = d.count;
          setCount(d.count);
        }
      })
      .catch(() => {});
  }, []);

  const link = "text-ink-dim underline-offset-2 transition hover:text-ink hover:underline";

  return (
    <div className="relative inline-flex max-w-full items-center justify-center">
      {/* weak dark fade behind the credit — soft-edged, no hard pill outline */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-[-18px] inset-y-[-6px] rounded-full bg-bg-deep/70 blur-[10px]"
      />

      <div className="relative flex flex-wrap items-center justify-center gap-x-[clamp(3px,1.4vw,6px)] gap-y-[4px] text-[length:clamp(9px,2.7vw,13.5px)] font-semibold leading-none text-ink-soft">
        <span className="text-ink-mute">Built by</span>

        <a href="https://github.com/obraims" target="_blank" rel="noopener" className={link}>
          @obraims
        </a>

        <span className="text-ink-mute">•</span>

        <a
          href="https://ko-fi.com/obraims"
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-[4px] font-bold text-brand transition hover:opacity-85 underline-offset-2 hover:underline"
        >
          <span>☕</span>
          <span>Buy me a coffee</span>
        </a>

        {count !== null && count > 0 && (
          <>
            <span className="text-ink-mute">&amp;</span>
            <a href={CONTRIBUTORS_URL} target="_blank" rel="noopener" className={link}>
              <span>{count}</span> amazing contributors
            </a>
          </>
        )}
      </div>
    </div>
  );
}
