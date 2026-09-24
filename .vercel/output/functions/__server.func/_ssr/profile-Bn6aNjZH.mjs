import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, W as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as withTimeout } from "./email.server-DO3567x7.mjs";
import { t as COUNTRIES } from "./avatar-DYTTtK-m.mjs";
import { a as getMyAccount, f as rerollMyAvatar, h as updateMyProfile, m as updateMyAvatar } from "./profiles-D-Lv5pW_.mjs";
import { g as Button } from "./router-Zz1eqit4.mjs";
import { t as RequireAuth } from "./require-auth-DTCX3s__.mjs";
import { t as AppShell } from "./app-shell-oKvsAQA6.mjs";
import { t as PlayerAvatar } from "./player-avatar-CasQNDH6.mjs";
import { n as RankInsignia, t as RankChip } from "./rank-insignia-BIGdsRV9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-Bn6aNjZH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProfilePage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RequireAuth, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProfileBody, {}) });
}
async function fileToAvatar(file) {
	if (file.size > 2e6) throw new Error("La imagen pesa demasiado (máx 2 MB).");
	const bitmap = await createImageBitmap(file);
	const canvas = document.createElement("canvas");
	canvas.width = 256;
	canvas.height = 256;
	const ctx = canvas.getContext("2d");
	if (!ctx) throw new Error("No se pudo procesar la imagen.");
	const scale = Math.max(256 / bitmap.width, 256 / bitmap.height);
	const w = bitmap.width * scale;
	const h = bitmap.height * scale;
	ctx.drawImage(bitmap, (256 - w) / 2, (256 - h) / 2, w, h);
	const url = canvas.toDataURL("image/jpeg", .82);
	if (url.length > 18e4) throw new Error("La imagen comprimida sigue siendo demasiado grande.");
	return url;
}
function ProfileBody() {
	const [data, setData] = (0, import_react.useState)(null);
	const [displayName, setDisplayName] = (0, import_react.useState)("");
	const [username, setUsername] = (0, import_react.useState)("");
	const [country, setCountry] = (0, import_react.useState)("España");
	const [avatar, setAvatar] = (0, import_react.useState)(null);
	const [msg, setMsg] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const fileRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		withTimeout(getMyAccount(), 1e4).then((d) => {
			setData(d);
			setDisplayName(d.profile.display_name ?? d.user.name ?? "");
			setUsername(d.profile.username ?? "");
			setCountry(d.profile.country ?? "España");
			setAvatar(d.profile.avatar_url ?? d.user.image);
		}).catch((err) => setMsg(err instanceof Error ? err.message : "No se pudo cargar."));
	}, []);
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "mx-auto max-w-4xl px-4 py-16",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-2xl bg-surface" }), msg ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-4 text-sm text-danger",
			children: msg
		}) : null]
	});
	async function save(e) {
		e.preventDefault();
		setBusy(true);
		setMsg(null);
		try {
			await withTimeout(updateMyProfile({ data: {
				displayName,
				username,
				country
			} }), 8e3);
			setMsg("Perfil actualizado.");
		} catch (err) {
			setMsg(err instanceof Error ? err.message : "No se pudo guardar.");
		} finally {
			setBusy(false);
		}
	}
	async function reroll() {
		setBusy(true);
		setMsg(null);
		try {
			const res = await withTimeout(rerollMyAvatar(), 8e3);
			setAvatar(res.avatarUrl);
			setMsg("Logo nuevo asignado.");
		} catch (err) {
			setMsg(err instanceof Error ? err.message : "No se pudo generar.");
		} finally {
			setBusy(false);
		}
	}
	async function onFile(file) {
		if (!file) return;
		setBusy(true);
		setMsg(null);
		try {
			const url = await fileToAvatar(file);
			await withTimeout(updateMyAvatar({ data: { avatarUrl: url } }), 8e3);
			setAvatar(url);
			setMsg("Logo actualizado.");
		} catch (err) {
			setMsg(err instanceof Error ? err.message : "No se pudo subir.");
		} finally {
			setBusy(false);
			if (fileRef.current) fileRef.current.value = "";
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {
		title: "Perfil",
		kicker: "Identidad",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "glass-card rounded-2xl p-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlayerAvatar, {
							src: avatar,
							name: username || "VANT",
							seed: data.user.id,
							size: 72
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute -bottom-1 -right-1 rounded-full bg-bg p-0.5",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RankInsignia, {
								rankKey: data.rank.key,
								size: "sm"
							})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-xl",
							children: data.profile.username ?? "sin username"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: data.user.email
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RankChip, {
							rankKey: data.rank.key,
							points: data.profile.points,
							className: "mt-2"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-subtle",
							children: data.user.emailVerified ? "Verificado" : "Sin verificar"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-subtle",
							children: ["Alta: ", new Date(data.user.createdAt).toLocaleDateString("es")]
						})
					] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-5 flex flex-wrap gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "ghost",
							disabled: busy,
							onClick: () => void reroll(),
							children: "Generar otro logo"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "ghost",
							disabled: busy,
							onClick: () => fileRef.current?.click(),
							children: "Subir logo"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							ref: fileRef,
							type: "file",
							accept: "image/png,image/jpeg,image/webp",
							className: "hidden",
							onChange: (e) => void onFile(e.target.files?.[0])
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: save,
					className: "mt-8 grid gap-3 sm:max-w-md",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-xs text-muted",
							children: ["Nombre", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "field mt-1",
								value: displayName,
								onChange: (e) => setDisplayName(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-xs text-muted",
							children: ["Username", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "field mt-1",
								value: username,
								onChange: (e) => setUsername(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-xs text-muted",
							children: ["País", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								className: "field mt-1",
								value: country,
								onChange: (e) => setCountry(e.target.value),
								children: COUNTRIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: c }, c))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-xs text-muted",
							children: ["Email (no se cambia aquí)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								className: "field mt-1 opacity-60",
								value: data.user.email ?? "",
								readOnly: true
							})]
						}),
						msg ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-cyan",
							children: msg
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: busy,
							children: busy ? "Guardando…" : "Guardar"
						})
					]
				})
			]
		})
	});
}
//#endregion
export { ProfilePage as component };
