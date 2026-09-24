//#region node_modules/.nitro/vite/services/ssr/assets/plans-BL2SEEb7.js
/**
* Price IDs synced 2026-09-20 from live Stripe account VANT (acct_1UHFf4EamHVhBbtr).
* Currency is EUR. Founding Mark uses the one-time price, not the leftover monthly default.
*/
var PLANS = [
	{
		id: "scout",
		code: "00",
		name: "Scout",
		tagline: "Entra al ecosistema. Postúlate. Observa operaciones en vivo.",
		priceLabel: "Gratis",
		priceHint: "Siempre",
		cadence: "free",
		productId: "prod_VHu8LSB2J0hCpu",
		priceId: null,
		liveCheckout: "/apply",
		features: [
			"Postulación a tryouts",
			"Feed de estado del ecosistema",
			"Acceso comunitario Scout",
			"Alertas de eventos públicos"
		],
		cta: "Postularme"
	},
	{
		id: "founding",
		code: "01",
		name: "Founding Mark",
		tagline: "Marca de fundador de por vida. Cupo limitado a 50.",
		priceLabel: "€19",
		priceHint: "Pago único",
		cadence: "once",
		productId: "prod_VHsRdwNODMyOWx",
		priceId: "price_1UHgp0EamHVhBbtrPKcsn55m",
		liveCheckout: "https://vantcall.vercel.app/join/founding",
		features: [
			"Founding Mark de por vida",
			"90 días de Operator incluidos",
			"Prioridad en revisión de tryouts",
			"Nombre en el muro de fundadores"
		],
		cta: "Tomar mi marca"
	},
	{
		id: "operator",
		code: "02",
		name: "Operator",
		tagline: "El plan del jugador que compite cada semana.",
		priceLabel: "€10",
		priceHint: "por mes",
		cadence: "month",
		featured: true,
		productId: "prod_VHryjsGmG3vcZC",
		priceId: "price_1UHIEMEamHVhBbtre6m9Ch9v",
		liveCheckout: "https://vantcall.vercel.app/join/operator",
		features: [
			"Perfil de jugador y stats",
			"Arena de entrenamiento",
			"Rol Operator en Discord",
			"Prioridad en tryouts y eventos"
		],
		cta: "Activar Operator"
	},
	{
		id: "command",
		code: "03",
		name: "Command",
		tagline: "Para orgs que operan roster, no solo juegan.",
		priceLabel: "€29",
		priceHint: "por mes",
		cadence: "month",
		productId: "prod_VHsMD1SnrnyNCh",
		priceId: "price_1UHIc2EamHVhBbtrKj2SAY3c",
		liveCheckout: "https://vantcall.vercel.app/join/command",
		features: [
			"Roster y pipeline de postulaciones",
			"Cupos de eventos y brackets",
			"Analytics de org",
			"Canal Command en Discord"
		],
		cta: "Abrir Command"
	}
];
function planById(id) {
	return PLANS.find((plan) => plan.id === id) ?? null;
}
var STRIPE_ACCOUNT = "feispla, Ltd.";
var OPS_EMAIL = "feispla@hotmail.com";
var OPS_EMAIL_ALT = "feispla@zohomail.com";
var CONTACT_EMAIL = "feispla@hotmail.com";
var KICK_URL = "https://kick.com/feispla";
//#endregion
export { PLANS as a, OPS_EMAIL_ALT as i, KICK_URL as n, STRIPE_ACCOUNT as o, OPS_EMAIL as r, planById as s, CONTACT_EMAIL as t };
