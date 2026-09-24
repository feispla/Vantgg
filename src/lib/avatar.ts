/** Deterministic player marks. Pure, client-safe. */

function hashSeed(seed: string): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

const PALETTES = [
  ["#22d3ee", "#3b82f6", "#d7dde8"],
  ["#34d399", "#22d3ee", "#f4f4f5"],
  ["#e8b86d", "#f07178", "#d7dde8"],
  ["#3b82f6", "#6366f1", "#22d3ee"],
  ["#f07178", "#e8b86d", "#22d3ee"],
  ["#a78bfa", "#22d3ee", "#d7dde8"],
  ["#fb7185", "#3b82f6", "#34d399"],
  ["#38bdf8", "#818cf8", "#f4f4f5"],
] as const;

export function avatarDataUrl(seed: string): string {
  const h = hashSeed(seed || "vant");
  const palette = PALETTES[h % PALETTES.length]!;
  const a = palette[0];
  const b = palette[1];
  const c = palette[2];
  const rot = (h >>> 8) % 360;
  const style = (h >>> 16) % 6;
  const cx = 40 + ((h >>> 4) % 9) - 4;
  const cy = 40 + ((h >>> 12) % 9) - 4;

  let motif = "";
  if (style === 0) {
    motif = `<polygon points="40,12 64,52 16,52" fill="${a}"/>
      <circle cx="${cx}" cy="${cy}" r="11" fill="${b}"/>`;
  } else if (style === 1) {
    motif = `<rect x="18" y="18" width="44" height="44" rx="8" fill="${a}" transform="rotate(${rot} 40 40)"/>
      <rect x="28" y="28" width="24" height="24" rx="4" fill="#07060c"/>`;
  } else if (style === 2) {
    motif = `<circle cx="40" cy="40" r="26" fill="none" stroke="${a}" stroke-width="6"/>
      <circle cx="${cx}" cy="${cy}" r="10" fill="${b}"/>
      <path d="M18 54 L40 22 L62 54" fill="none" stroke="${c}" stroke-width="3"/>`;
  } else if (style === 3) {
    motif = `<path d="M40 10 L70 40 L40 70 L10 40 Z" fill="${a}"/>
      <path d="M40 24 L56 40 L40 56 L24 40 Z" fill="#07060c"/>
      <circle cx="40" cy="40" r="6" fill="${b}"/>`;
  } else if (style === 4) {
    motif = `<rect x="14" y="30" width="52" height="20" rx="4" fill="${a}"/>
      <rect x="30" y="14" width="20" height="52" rx="4" fill="${b}"/>
      <circle cx="40" cy="40" r="8" fill="${c}"/>`;
  } else {
    motif = `<path d="M20 18 H60 L40 70 Z" fill="${a}"/>
      <circle cx="40" cy="32" r="8" fill="#07060c"/>
      <rect x="36" y="46" width="8" height="14" fill="${b}"/>`;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80">
  <rect width="80" height="80" rx="18" fill="#101018"/>
  <rect x="2" y="2" width="76" height="76" rx="16" fill="none" stroke="${a}" stroke-opacity="0.45" stroke-width="2"/>
  ${motif}
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.replace(/\s+/g, " ").trim())}`;
}

export function newAvatarSeed(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `vant-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function isAvatarUrl(value: string): boolean {
  return (
    value.startsWith("data:image/svg+xml") ||
    value.startsWith("data:image/png") ||
    value.startsWith("data:image/jpeg") ||
    value.startsWith("data:image/webp") ||
    value.startsWith("https://")
  );
}
