import type { Card, Finish } from "@/lib/scoring/types";

// hex (#rgb / #rrggbb) → rgba() string, so a founder's single accent hex can
// drive translucent glows/tints without hand-writing each alpha variant.
export function rgba(hex: string, a: number): string {
  const h = hex.replace("#", "");
  const f = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(f, 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

// Each finish maps to a FUT background image (public/cards), the text ink the
// Python generator uses for that card, a glow for the card's drop-shadow, and
// the avatar filter from the Claude Design card: avatarTint is a RADIAL tint —
// transparent in the centre so the photo shows clearly, ramping to the card
// colour toward the edges so they blend in; avatarHalo is the avatar's glow.
// totw reuses the TOTY art; icon uses the legend art.
export interface CardTheme {
  bg: string;
  ink: string;
  glow: string;
  avatarTint: string;
  avatarHalo: string;
}

export const CARD_THEME: Record<Finish, CardTheme> = {
  bronze: {
    bg: "/cards/bronze.png",
    ink: "#3a2717",
    glow: "rgba(190,120,60,.45)",
    avatarTint: "radial-gradient(ellipse 72% 76% at 52% 40%, transparent 46%, rgba(106,69,39,.26) 78%, rgba(50,31,14,.44))",
    avatarHalo: "rgba(214,163,110,.4)",
  },
  silver: {
    bg: "/cards/silver.png",
    ink: "#303536",
    glow: "rgba(170,188,210,.5)",
    avatarTint: "radial-gradient(ellipse 72% 76% at 52% 40%, transparent 46%, rgba(170,188,210,.22) 78%, rgba(70,78,90,.42))",
    avatarHalo: "rgba(220,228,238,.4)",
  },
  gold: {
    bg: "/cards/gold.png",
    ink: "#46390c",
    glow: "rgba(225,185,80,.55)",
    avatarTint: "radial-gradient(ellipse 72% 76% at 52% 40%, transparent 46%, rgba(243,214,121,.24) 78%, rgba(156,118,33,.44))",
    avatarHalo: "rgba(243,214,121,.45)",
  },
  totw: {
    bg: "/cards/toty.webp",
    ink: "#ebcd5b",
    glow: "rgba(90,140,255,.55)",
    avatarTint: "radial-gradient(ellipse 72% 76% at 52% 40%, transparent 46%, rgba(74,120,210,.22) 78%, rgba(14,35,80,.46))",
    avatarHalo: "rgba(127,168,255,.45)",
  },
  toty: {
    bg: "/cards/toty.webp",
    ink: "#ebcd5b",
    glow: "rgba(90,140,255,.55)",
    avatarTint: "radial-gradient(ellipse 72% 76% at 52% 40%, transparent 46%, rgba(74,120,210,.22) 78%, rgba(14,35,80,.46))",
    avatarHalo: "rgba(127,168,255,.45)",
  },
  icon: {
    bg: "/cards/legend.png",
    ink: "#625217",
    glow: "rgba(243,213,128,.5)",
    avatarTint: "radial-gradient(ellipse 72% 76% at 52% 40%, transparent 46%, rgba(243,214,121,.24) 78%, rgba(120,90,30,.46))",
    avatarHalo: "rgba(243,214,136,.5)",
  },
  // Fallback only — real founder cards carry per-person art/accent via
  // resolveCardTheme(); this keeps the Record<Finish> map total.
  founder: {
    bg: "/cards/founder-red.png",
    ink: "#f6f8fb",
    glow: "rgba(255,47,69,.55)",
    avatarTint: "radial-gradient(ellipse 72% 76% at 52% 40%, transparent 50%, rgba(0,0,0,.30))",
    avatarHalo: "rgba(255,47,69,.42)",
  },
};

// Per-card theme: identical to CARD_THEME for everyone except founders, who get
// their own art, a near-white ink, and a glow/halo derived from their accent.
export function resolveCardTheme(card: Card): CardTheme {
  const base = CARD_THEME[card.finish];
  if (!card.founder) return base;
  const a = card.founder.accent;
  return {
    bg: card.founder.art,
    ink: card.founder.ink ?? "#f6f8fb",
    glow: rgba(a, 0.55),
    avatarTint: "radial-gradient(ellipse 72% 76% at 52% 40%, transparent 50%, rgba(0,0,0,.30))",
    avatarHalo: rgba(a, 0.42),
  };
}

export interface ResultTheme {
  glow: string;
  chip: string;
  ink: string;
}

export const RESULT_THEME: Record<Finish, ResultTheme> = {
  bronze: { glow: "rgba(190,120,60,.34)", chip: "#2A1A0C", ink: "#F0CFA8" },
  silver: { glow: "rgba(170,188,210,.34)", chip: "#262B33", ink: "#D6DCE6" },
  gold: { glow: "rgba(225,185,80,.4)", chip: "#3A2806", ink: "#F3D679" },
  totw: { glow: "rgba(90,140,255,.5)", chip: "#10254F", ink: "#CADBFF" },
  toty: { glow: "rgba(90,140,255,.5)", chip: "#10254F", ink: "#CADBFF" },
  icon: { glow: "rgba(243,213,128,.45)", chip: "#2A1A45", ink: "#F3D688" },
  founder: { glow: "rgba(255,47,69,.4)", chip: "#221016", ink: "#ff6273" },
};

// Per-card result accent: founders tint the whole scout report to their own
// accent (red for obraims, chrome for Mawsis); everyone else uses RESULT_THEME.
export function resolveResultTheme(card: Card): ResultTheme {
  const base = RESULT_THEME[card.finish];
  if (!card.founder) return base;
  return { ink: card.founder.accent, glow: rgba(card.founder.accent, 0.34), chip: base.chip };
}

// ---- Duel kit clash: TOTY/TOTW vs silver, and nothing else ----
// Those tiers' inks are near-twins (toty #CADBFF vs silver #D6DCE6), so in that
// one matchup nothing side-coded on the Duel (names, bars, radars, scoreboard)
// says whose color is whose. The fix is surgical, only for this pairing: the
// TOTY/TOTW side swaps its pale ink for the tier's own saturated blue — the
// color its glow already wears — so it reads MORE toty, and silver stays
// silver. Every other matchup keeps its true tier inks.
const TOTY_KIT: ResultTheme = { ink: "#7fa8ff", glow: RESULT_THEME.toty.glow, chip: RESULT_THEME.toty.chip };
const wearsTotyBlue = (f: Finish) => f === "toty" || f === "totw";

export function duelThemes(challenger: Card, opponent: Card): { home: ResultTheme; away: ResultTheme } {
  const home = resolveResultTheme(challenger);
  const away = resolveResultTheme(opponent);
  if (wearsTotyBlue(challenger.finish) && opponent.finish === "silver") return { home: TOTY_KIT, away };
  if (challenger.finish === "silver" && wearsTotyBlue(opponent.finish)) return { home, away: TOTY_KIT };
  return { home, away };
}

// Confetti palette per tier — gold for prestige, green always woven in (brand).
// Founders burst in their own accent. Consumed by the card reveal (the Duel
// deliberately keeps its full time clean — no confetti).
const CONFETTI: Partial<Record<Finish, string[]>> = {
  toty: ["#e9cc74", "#d4af37", "#7fa8ff", "#ffffff", "#39d353"],
  icon: ["#e9cc74", "#d4af37", "#f5f0e1", "#ffffff", "#39d353"],
  totw: ["#39d353", "#e9cc74", "#ffffff", "#7fa8ff"],
};

export function confettiPalette(card: Card): string[] {
  if (card.founder) return [card.founder.accent, "#ffffff", "#39d353"];
  return CONFETTI[card.finish] ?? ["#39d353", "#e9cc74", "#ffffff"];
}

export type CardSkin = "classic" | "carbon" | "cyberpunk" | "matrix" | "diamond";

export interface SkinStyle {
  label: string;
  color: string;
  filter: string;
  overlayStyle?: React.CSSProperties;
}

export const CARD_SKINS: Record<CardSkin, SkinStyle> = {
  classic: {
    label: "Classic",
    color: "#39d353",
    filter: "",
  },
  carbon: {
    label: "Carbon",
    color: "#7f7f7f",
    filter: "grayscale(0.85) contrast(1.35) brightness(0.8)",
    overlayStyle: {
      backgroundImage: "linear-gradient(45deg, rgba(255,255,255,0.03) 25%, transparent 25%), linear-gradient(-45deg, rgba(255,255,255,0.03) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.03) 75%), linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.03) 75%)",
      backgroundSize: "6px 6px",
      mixBlendMode: "overlay",
    },
  },
  cyberpunk: {
    label: "Cyberpunk",
    color: "#ff007f",
    filter: "saturate(1.7) contrast(1.1) hue-rotate(240deg)",
    overlayStyle: {
      backgroundImage: "linear-gradient(135deg, rgba(255,0,128,0.2) 0%, rgba(0,255,255,0.2) 100%)",
      mixBlendMode: "color-dodge",
    },
  },
  matrix: {
    label: "Matrix",
    color: "#00ff00",
    filter: "grayscale(1) sepia(0.85) hue-rotate(90deg) saturate(3.5) brightness(0.95)",
    overlayStyle: {
      backgroundImage: "linear-gradient(rgba(0, 255, 0, 0.05) 50%, rgba(0, 0, 0, 0.3) 50%)",
      backgroundSize: "100% 4px",
    },
  },
  diamond: {
    label: "Diamond",
    color: "#00e5ff",
    filter: "brightness(1.1) contrast(1.05) saturate(0.65)",
    overlayStyle: {
      backgroundImage: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 60%, rgba(0,229,255,0.2) 100%)",
      mixBlendMode: "overlay",
    },
  },
};
