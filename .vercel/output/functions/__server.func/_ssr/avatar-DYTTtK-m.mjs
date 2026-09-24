import { a as PLANS } from "./plans-BL2SEEb7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/avatar-DYTTtK-m.js
var TICKET_PRODUCTS = [
	{
		id: "vant-basic",
		kind: "ticket",
		code: "T1",
		name: "VANT BASIC",
		tagline: "Entra al circuito.",
		description: "Acceso comunitario, 1 entrada a torneos abiertos y perfil Ranked.",
		priceLabel: "€9",
		priceHint: "pago único",
		amountCents: 900,
		currency: "eur",
		billing: "once",
		available: true,
		stripePriceId: null,
		stripeProductId: null,
		tier: "basic",
		features: [
			"Ticket BASIC de por vida en esta temporada",
			"Inscripción a VANT Open",
			"Perfil Ranked (Bronze–Gold)",
			"Soporte estándar"
		],
		cta: "Comprar BASIC"
	},
	{
		id: "vant-pro",
		kind: "ticket",
		code: "T2",
		name: "VANT PRO",
		tagline: "Compite cada semana.",
		description: "Ranked completo, Pro Series y prioridad de tryouts.",
		priceLabel: "€19",
		priceHint: "pago único",
		amountCents: 1900,
		currency: "eur",
		billing: "once",
		featured: true,
		available: true,
		stripePriceId: null,
		stripeProductId: null,
		tier: "pro",
		features: [
			"Todo BASIC",
			"VANT Pro Series",
			"Sala privada / scrims",
			"Prioridad en tryouts",
			"Rol Operator equivalente"
		],
		cta: "Comprar PRO"
	},
	{
		id: "vant-elite",
		kind: "ticket",
		code: "T3",
		name: "VANT ELITE",
		tagline: "El asiento de invitational.",
		description: "Elite Invitational, cupo Command y marca visible en Ranked.",
		priceLabel: "€39",
		priceHint: "pago único",
		amountCents: 3900,
		currency: "eur",
		billing: "once",
		available: true,
		stripePriceId: null,
		stripeProductId: null,
		tier: "elite",
		features: [
			"Todo PRO",
			"VANT Elite Invitational",
			"Badge Elite en perfil",
			"Canal Command",
			"Revisión de verificación prioritaria"
		],
		cta: "Comprar ELITE"
	}
];
function planToProduct(plan) {
	const amount = plan.id === "founding" ? 1900 : plan.id === "operator" ? 1e3 : plan.id === "command" ? 2900 : 0;
	const tier = plan.id === "command" || plan.id === "founding" ? "elite" : plan.id === "operator" ? "pro" : null;
	return {
		id: plan.id,
		kind: "membership",
		code: plan.code,
		name: plan.name,
		tagline: plan.tagline,
		description: plan.tagline,
		priceLabel: plan.priceLabel,
		priceHint: plan.priceHint,
		amountCents: amount,
		currency: "eur",
		billing: plan.cadence,
		featured: plan.featured,
		available: plan.id !== "scout",
		stripePriceId: plan.priceId,
		stripeProductId: plan.productId,
		tier,
		features: plan.features,
		cta: plan.cta
	};
}
var MEMBERSHIP_PRODUCTS = PLANS.map(planToProduct);
var ALL_PRODUCTS = [...TICKET_PRODUCTS, ...MEMBERSHIP_PRODUCTS];
function productById(id) {
	if (!id) return null;
	return ALL_PRODUCTS.find((p) => p.id === id) ?? null;
}
var TIER_RANK = {
	basic: 1,
	pro: 2,
	elite: 3
};
function tierMeets(have, need) {
	if (need === "none") return true;
	if (!have) return false;
	return TIER_RANK[have] >= TIER_RANK[need];
}
var COUNTRIES = [
	"España",
	"México",
	"Argentina",
	"Colombia",
	"Chile",
	"Perú",
	"Estados Unidos",
	"Reino Unido",
	"Francia",
	"Alemania",
	"Italia",
	"Portugal",
	"Brasil",
	"Canadá",
	"Países Bajos",
	"Bélgica",
	"Suecia",
	"Polonia",
	"Turquía",
	"Japón",
	"Corea del Sur",
	"Australia",
	"Otro"
];
/** Deterministic player marks. Pure, client-safe. */
function hashSeed(seed) {
	let h = 2166136261;
	for (let i = 0; i < seed.length; i++) {
		h ^= seed.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	return h >>> 0;
}
var PALETTES = [
	[
		"#22d3ee",
		"#3b82f6",
		"#d7dde8"
	],
	[
		"#34d399",
		"#22d3ee",
		"#f4f4f5"
	],
	[
		"#e8b86d",
		"#f07178",
		"#d7dde8"
	],
	[
		"#3b82f6",
		"#6366f1",
		"#22d3ee"
	],
	[
		"#f07178",
		"#e8b86d",
		"#22d3ee"
	],
	[
		"#a78bfa",
		"#22d3ee",
		"#d7dde8"
	],
	[
		"#fb7185",
		"#3b82f6",
		"#34d399"
	],
	[
		"#38bdf8",
		"#818cf8",
		"#f4f4f5"
	]
];
function avatarDataUrl(seed) {
	const h = hashSeed(seed || "vant");
	const palette = PALETTES[h % PALETTES.length];
	const a = palette[0];
	const b = palette[1];
	const c = palette[2];
	const rot = (h >>> 8) % 360;
	const style = (h >>> 16) % 6;
	const cx = 40 + (h >>> 4) % 9 - 4;
	const cy = 40 + (h >>> 12) % 9 - 4;
	let motif = "";
	if (style === 0) motif = `<polygon points="40,12 64,52 16,52" fill="${a}"/>
      <circle cx="${cx}" cy="${cy}" r="11" fill="${b}"/>`;
	else if (style === 1) motif = `<rect x="18" y="18" width="44" height="44" rx="8" fill="${a}" transform="rotate(${rot} 40 40)"/>
      <rect x="28" y="28" width="24" height="24" rx="4" fill="#07060c"/>`;
	else if (style === 2) motif = `<circle cx="40" cy="40" r="26" fill="none" stroke="${a}" stroke-width="6"/>
      <circle cx="${cx}" cy="${cy}" r="10" fill="${b}"/>
      <path d="M18 54 L40 22 L62 54" fill="none" stroke="${c}" stroke-width="3"/>`;
	else if (style === 3) motif = `<path d="M40 10 L70 40 L40 70 L10 40 Z" fill="${a}"/>
      <path d="M40 24 L56 40 L40 56 L24 40 Z" fill="#07060c"/>
      <circle cx="40" cy="40" r="6" fill="${b}"/>`;
	else if (style === 4) motif = `<rect x="14" y="30" width="52" height="20" rx="4" fill="${a}"/>
      <rect x="30" y="14" width="20" height="52" rx="4" fill="${b}"/>
      <circle cx="40" cy="40" r="8" fill="${c}"/>`;
	else motif = `<path d="M20 18 H60 L40 70 Z" fill="${a}"/>
      <circle cx="40" cy="32" r="8" fill="#07060c"/>
      <rect x="36" y="46" width="8" height="14" fill="${b}"/>`;
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80" width="80" height="80">
  <rect width="80" height="80" rx="18" fill="#101018"/>
  <rect x="2" y="2" width="76" height="76" rx="16" fill="none" stroke="${a}" stroke-opacity="0.45" stroke-width="2"/>
  ${motif}
</svg>`;
	return `data:image/svg+xml;utf8,${encodeURIComponent(svg.replace(/\s+/g, " ").trim())}`;
}
function newAvatarSeed() {
	if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
	return `vant-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
function isAvatarUrl(value) {
	return value.startsWith("data:image/svg+xml") || value.startsWith("data:image/png") || value.startsWith("data:image/jpeg") || value.startsWith("data:image/webp") || value.startsWith("https://");
}
//#endregion
export { newAvatarSeed as a, isAvatarUrl as i, TICKET_PRODUCTS as n, productById as o, avatarDataUrl as r, tierMeets as s, COUNTRIES as t };
