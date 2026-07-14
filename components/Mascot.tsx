"use client";

import { memo } from "react";

// DevTier mascot — the real logo asset (public/mascot.png): the floating AI assistant.
// footballer kicking the WC26 ball. Rendered as-is; `animate` adds a gentle
// float (used on the hero/loading screen). The ball is part of the artwork, so
// the legacy `kick`/`ball` props are accepted but no longer composite anything.
interface MascotProps {
  size?: number;
  className?: string;
  animate?: boolean;
  /** @deprecated ball is baked into the asset; kept for call-site compatibility */
  kick?: boolean;
  /** @deprecated ball is baked into the asset; kept for call-site compatibility */
  ball?: boolean;
}

function Mascot({ size = 220, className, animate = true }: MascotProps) {
  return (
    <img
      src="/mascot.png"
      alt="DevTier mascot — floating MatchMind robot assistant"
      width={size}
      height={size}
      className={`${animate ? "animate-float" : ""} ${className ?? ""}`}
      style={{ width: size, height: size, objectFit: "contain", display: "block", pointerEvents: "none", willChange: "transform" }}
      data-visualsearch="false"
      data-pin-nopin="true"
    />
  );
}

export default memo(Mascot);
