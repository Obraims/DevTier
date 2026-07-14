"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import Mascot from "./Mascot";

interface Props {
  loading: boolean;
  error: string | null;
  scoutCount: number | null;
  onScout: (name: string) => void;
  onOpenModal: () => void;
}

const exampleClass =
  "cursor-pointer inline-flex items-center rounded-full bg-white/[0.03] border border-white/[0.06] px-2.5 py-0.5 font-mono text-[12px] text-ink-soft transition-all duration-200 hover:bg-brand/[0.08] hover:border-brand/40 hover:text-brand hover:-translate-y-[1px] active:translate-y-0";

export default function ScoutForm({
  loading,
  error,
  scoutCount,
  onScout,
  onOpenModal,
}: Props) {
  const [name, setName] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) onScout(name);
  };

  return (
    <div className="min-w-0 flex-1">
      {/* mascot — the brand face on the hero */}
      <div className="mb-1 -ml-2 max-[860px]:mx-auto max-[860px]:flex max-[860px]:justify-center">
        <Mascot size={150} />
      </div>

      {/* crossover "fixture" tag — the dev world (mono GITHUB) versus the
          tournament (broadcast WORLD CUP 26), joined by the × the concept implies. */}
      <div className="mb-[20px] inline-flex items-center gap-[10px] rounded-[10px] border border-white/[0.08] bg-white/[0.04] px-[14px] py-[7px] shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_4px_12px_rgba(0,0,0,0.2)] max-[860px]:mx-auto">
        <span className="font-mono text-[10.5px] font-bold tracking-[.2em] text-brand/90">
          GITHUB
        </span>
        <span className="font-display text-[15px] mt-[1px] leading-none text-white/40">
          ×
        </span>
        <span className="font-display text-[15.5px] leading-none tracking-[.08em] text-ink">
          WORLD CUP <span className="text-gold-hi drop-shadow-[0_0_8px_rgba(233,204,116,0.3)]">26</span>
        </span>
      </div>

      <h1 className="font-display m-0 mb-4 text-[clamp(52px,7vw,104px)] leading-[.82] tracking-[.005em] bg-gradient-to-r from-white via-ink-soft to-brand bg-clip-text text-transparent drop-shadow-[0_4px_12px_rgba(57,211,83,0.15)]">
        GET SCOUTED<span className="text-brand">.</span>
      </h1>
      <p className="mb-[26px] max-w-[420px] text-[clamp(15px,1.7vw,18px)] font-medium leading-[1.5] text-ink-dim max-[860px]:mx-auto">
        Your GitHub stats, turned into a World-Cup-style player card rated out
        of 99.
      </p>

      <form
        onSubmit={submit}
        className="m-0 flex max-w-[460px] flex-wrap gap-[10px] max-[860px]:mx-auto"
      >
        <div className="relative min-w-[200px] flex-1">
          <span className="font-mono pointer-events-none absolute left-[18px] top-1/2 -translate-y-1/2 text-[17px] font-semibold text-brand/70"></span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="github username"
            autoComplete="off"
            spellCheck={false}
            aria-label="GitHub username"
            className="font-mono h-14 w-full rounded-[14px] border border-white/10 bg-[#0a082b] pl-[34px] pr-5 text-[16px] font-medium text-white outline-none transition-[border-color,background-color] duration-200 focus:border-brand/80 focus:bg-[#0c0a34] focus:shadow-[0_0_0_4px_rgba(57,211,83,.16),0_0_16px_rgba(57,211,83,.20),inset_0_1px_1px_rgba(255,255,255,0.05)]"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="font-display group flex h-14 items-center gap-2 rounded-[14px] bg-gradient-to-b from-brand to-brand-mid px-7 text-[20px] font-bold tracking-[.08em] text-[#04130a] shadow-[0_0_0_1px_rgba(57,211,83,.4),0_10px_25px_-5px_rgba(57,211,83,0.4)] transition-all duration-200 ease-out hover:-translate-y-[2px] hover:from-brand-hi hover:to-brand hover:shadow-[0_0_0_1px_rgba(57,211,83,.5),0_15px_30px_-5px_rgba(57,211,83,0.5)] active:translate-y-0 active:scale-[0.98] disabled:cursor-wait disabled:opacity-75 disabled:transform-none"
        >
          {loading ? "SCOUTING…" : "SCOUT"}
          {!loading && (
            <ArrowRight
              size={19}
              strokeWidth={2.6}
              className="transition-transform group-hover:translate-x-0.5"
            />
          )}
        </button>
      </form>

      {error && (
        <div
          role="alert"
          className="mt-[13px] max-w-[460px] rounded-[10px] border border-[#f85149]/30 bg-[#f85149]/10 px-[13px] py-[10px] text-[13.5px] font-medium text-[#ff9d96]"
        >
          {error}
        </div>
      )}

      <div className="mt-[16px] flex flex-wrap items-center gap-2 text-[13px] text-ink-mute max-[860px]:justify-center">
        <span>try:</span>
        <button
          type="button"
          onClick={() => onScout("torvalds")}
          className={exampleClass}
        >
          torvalds
        </button>
        <button
          type="button"
          onClick={() => onScout("sindresorhus")}
          className={exampleClass}
        >
          sindresorhus
        </button>
        <span>or your own</span>
      </div>

      {/* live tally — a broadcast-style scoreboard count */}
      <div className="mt-[26px] flex flex-wrap items-center gap-x-[16px] gap-y-[12px] max-[860px]:justify-center">
        {scoutCount != null && (
          <>
            <span className="inline-flex items-center gap-[9px] rounded-lg bg-white/[0.02] border border-white/[0.05] px-3 py-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
              <span className="relative flex h-[7px] w-[7px]" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand opacity-65" />
                <span className="relative inline-flex h-[7px] w-[7px] rounded-full bg-brand" />
              </span>
              <span className="font-display text-[20px] leading-none tracking-wider tabular-nums text-ink">
                {scoutCount.toLocaleString("en-US")}
              </span>
              <span className="text-[11.5px] font-medium text-ink-soft">cards rated</span>
            </span>
            <span aria-hidden className="h-[16px] w-px bg-white/[0.12] max-[860px]:hidden" />
          </>
        )}
        <button
          type="button"
          onClick={onOpenModal}
          className="cursor-pointer text-[12.5px] font-semibold text-ink-soft underline-offset-2 transition hover:text-brand hover:underline"
        >
          how it works ↗
        </button>
      </div>
    </div>
  );
}
