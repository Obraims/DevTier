import { describe, expect, it } from "vitest";
import { SAMPLE_CARDS } from "@/lib/github/samples";

// Locks the showcase invariants: pinned origin countries, and the language logo
// matching the headline language (no fall-through to a different icon).
describe("showcase samples", () => {
  const by = Object.fromEntries(SAMPLE_CARDS.map((c) => [c.login, c]));

  it("pin origin countries (birthplace, not the GitHub location)", () => {
    expect(by["ColeMurray"].country).toBe("us");
    expect(by["NeptuneHub"].country).toBe("it");
    expect(by["hrydgard"].country).toBe("se");
    expect(by["mvanhorn"].country).toBe("us");
    expect(by["binaricat"].country).toBe("cn");
  });

  it("language logo matches the top language (Devicon), never a mismatch", () => {
    expect(by["ColeMurray"].topLanguage).toBe("TypeScript");
    expect(by["ColeMurray"].languageLogo).toEqual({ name: "TypeScript", slug: "typescript-original" });
    expect(by["NeptuneHub"].topLanguage).toBe("Go");
    expect(by["NeptuneHub"].languageLogo).toEqual({ name: "Go", slug: "go-original-wordmark" });
    expect(by["hrydgard"].topLanguage).toBe("C++");
    expect(by["hrydgard"].languageLogo).toEqual({ name: "C++", slug: "cplusplus-original" });
  });
});
