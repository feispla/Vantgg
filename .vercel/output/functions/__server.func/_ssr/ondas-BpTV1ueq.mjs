import { o as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, W as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { g as Button } from "./router-Zz1eqit4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ondas-BpTV1ueq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MAPS = [
	{
		id: "ink",
		label: "Tinta"
	},
	{
		id: "ocean",
		label: "Océano"
	},
	{
		id: "thermal",
		label: "Térmico"
	},
	{
		id: "mercury",
		label: "Mercurio"
	}
];
function colorize(v, map, out, i) {
	const t = Math.max(0, Math.min(1, .5 + v * .55));
	if (map === "ink") {
		const g = Math.floor(12 + t * 230);
		out[i] = g;
		out[i + 1] = g;
		out[i + 2] = Math.min(255, g + 8);
	} else if (map === "ocean") {
		out[i] = Math.floor(4 + t * 40);
		out[i + 1] = Math.floor(18 + t * 180);
		out[i + 2] = Math.floor(28 + t * 210);
	} else if (map === "thermal") {
		out[i] = Math.floor(t * t * 220);
		out[i + 1] = Math.floor(20 + t * 160);
		out[i + 2] = Math.floor(40 + (1 - t) * 80 + t * 160);
	} else {
		out[i] = Math.floor(30 + t * 180);
		out[i + 1] = Math.floor(36 + t * 190);
		out[i + 2] = Math.floor(42 + t * 200);
	}
	out[i + 3] = 255;
}
function FluidSim() {
	const canvasRef = (0, import_react.useRef)(null);
	const viscRef = (0, import_react.useRef)(.12);
	const forceRef = (0, import_react.useRef)(2.4);
	const mapRef = (0, import_react.useRef)("ocean");
	const clearRef = (0, import_react.useRef)(false);
	const [visc, setVisc] = (0, import_react.useState)(.12);
	const [force, setForce] = (0, import_react.useState)(2.4);
	const [map, setMap] = (0, import_react.useState)("ocean");
	viscRef.current = visc;
	forceRef.current = force;
	mapRef.current = map;
	(0, import_react.useEffect)(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d", { alpha: false });
		let w = 192;
		let h = 108;
		let h0 = new Float32Array(w * h);
		let h1 = new Float32Array(w * h);
		let h2 = new Float32Array(w * h);
		let img = new ImageData(w, h);
		let raf = 0;
		let last = performance.now();
		let acc = 0;
		const step = 1 / 60;
		const off = document.createElement("canvas");
		const offCtx = off.getContext("2d");
		function resize() {
			const dpr = Math.min(window.devicePixelRatio, 2);
			const cw = Math.max(1, canvas.clientWidth);
			const ch = Math.max(1, canvas.clientHeight);
			canvas.width = Math.floor(cw * dpr);
			canvas.height = Math.floor(ch * dpr);
			const cols = Math.max(96, Math.min(160, Math.round(cw / 8)));
			const rows = Math.max(54, Math.min(96, Math.round(cols * (ch / cw))));
			if (cols !== w || rows !== h) {
				w = cols;
				h = rows;
				h0 = new Float32Array(w * h);
				h1 = new Float32Array(w * h);
				h2 = new Float32Array(w * h);
				img = new ImageData(w, h);
				off.width = w;
				off.height = h;
			}
		}
		resize();
		const ro = new ResizeObserver(resize);
		ro.observe(canvas);
		function drop(nx, ny, amp) {
			const cx = nx * (w - 1);
			const cy = ny * (h - 1);
			const rad = 3.2;
			const r2 = rad * rad;
			for (let y = Math.max(1, Math.floor(cy - rad)); y <= Math.min(h - 2, Math.ceil(cy + rad)); y++) for (let x = Math.max(1, Math.floor(cx - rad)); x <= Math.min(w - 2, Math.ceil(cx + rad)); x++) {
				const dx = x - cx;
				const dy = y - cy;
				const d2 = dx * dx + dy * dy;
				if (d2 < r2) h1[y * w + x] += amp * (1 - d2 / r2);
			}
		}
		let drawing = false;
		function pos(ev) {
			const rect = canvas.getBoundingClientRect();
			return {
				x: (ev.clientX - rect.left) / rect.width,
				y: (ev.clientY - rect.top) / rect.height
			};
		}
		const down = (ev) => {
			drawing = true;
			canvas.setPointerCapture(ev.pointerId);
			const p = pos(ev);
			drop(p.x, p.y, forceRef.current);
		};
		const move = (ev) => {
			if (!drawing) return;
			const p = pos(ev);
			drop(p.x, p.y, forceRef.current * .55);
		};
		const up = () => {
			drawing = false;
		};
		canvas.addEventListener("pointerdown", down);
		canvas.addEventListener("pointermove", move);
		canvas.addEventListener("pointerup", up);
		canvas.addEventListener("pointercancel", up);
		canvas.addEventListener("pointerleave", up);
		function simulate() {
			if (clearRef.current) {
				h0.fill(0);
				h1.fill(0);
				h2.fill(0);
				clearRef.current = false;
			}
			const visc = viscRef.current;
			const c = .18;
			const damp = .995 - visc * .08;
			for (let y = 1; y < h - 1; y++) {
				const yw = y * w;
				for (let x = 1; x < w - 1; x++) {
					const i = yw + x;
					const n = h1[i - 1] + h1[i + 1] + h1[i - w] + h1[i + w] - 4 * h1[i];
					let v = (2 - visc * .35) * h1[i] - (1 - visc * .2) * h0[i] + c * n;
					v *= damp;
					h2[i] = v;
				}
			}
			const tmp = h0;
			h0 = h1;
			h1 = h2;
			h2 = tmp;
		}
		function draw() {
			const data = img.data;
			const map = mapRef.current;
			for (let i = 0; i < w * h; i++) colorize(h1[i], map, data, i * 4);
			offCtx.putImageData(img, 0, 0);
			ctx.imageSmoothingEnabled = true;
			ctx.drawImage(off, 0, 0, canvas.width, canvas.height);
		}
		let visible = true;
		const io = new IntersectionObserver((entries) => {
			visible = entries.some((e) => e.isIntersecting);
		});
		io.observe(canvas);
		function loop(now) {
			const dt = Math.min(.05, (now - last) / 1e3);
			last = now;
			const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
			if (!document.hidden && visible && !reduced) {
				acc += dt;
				let steps = 0;
				while (acc >= step && steps < 2) {
					simulate();
					acc -= step;
					steps += 1;
				}
				if (acc > step) acc = 0;
				draw();
			}
			raf = requestAnimationFrame(loop);
		}
		raf = requestAnimationFrame(loop);
		return () => {
			cancelAnimationFrame(raf);
			ro.disconnect();
			io.disconnect();
			canvas.removeEventListener("pointerdown", down);
			canvas.removeEventListener("pointermove", move);
			canvas.removeEventListener("pointerup", up);
			canvas.removeEventListener("pointercancel", up);
			canvas.removeEventListener("pointerleave", up);
		};
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative h-dvh w-full overflow-hidden bg-bg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
				ref: canvasRef,
				className: "absolute inset-0 h-full w-full touch-none"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(10,10,11,0.35)_100%)]" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "absolute left-4 right-4 top-4 z-10 flex flex-wrap items-end justify-between gap-3 sm:left-6 sm:right-6 sm:top-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[10px] uppercase tracking-[0.2em] text-cyan",
						children: "02 / Fluido"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-1 font-display text-2xl font-semibold tracking-[-0.04em] sm:text-3xl",
						children: "Campo de ondas"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 max-w-md text-sm text-muted",
						children: "Arrastra. Las ondas se expanden y se apagan. Sedoso, continuo."
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "/",
					className: "pointer-events-auto min-h-11 rounded-xl border border-line bg-surface/80 px-4 text-sm text-fg backdrop-blur-md",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex h-11 items-center",
						children: "Volver"
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute bottom-4 left-4 right-4 z-10 sm:bottom-6 sm:left-6 sm:right-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "pointer-events-auto rounded-2xl border border-line bg-surface/80 p-4 backdrop-blur-md sm:p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono text-[10px] uppercase tracking-[0.16em] text-subtle",
									children: ["Viscosidad ", visc.toFixed(2)]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: .02,
									max: .35,
									step: .01,
									value: visc,
									onChange: (e) => setVisc(Number(e.target.value)),
									className: "mt-2 h-11 w-full accent-cyan"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "font-mono text-[10px] uppercase tracking-[0.16em] text-subtle",
									children: ["Fuerza ", force.toFixed(1)]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "range",
									min: .6,
									max: 6,
									step: .1,
									value: force,
									onChange: (e) => setForce(Number(e.target.value)),
									className: "mt-2 h-11 w-full accent-cyan"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "ghost",
								onClick: () => {
									clearRef.current = true;
								},
								children: "Limpiar superficie"
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: MAPS.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setMap(m.id),
							className: `min-h-10 rounded-full border px-4 font-mono text-[10px] uppercase tracking-[0.14em] ${map === m.id ? "border-cyan bg-cyan/15 text-fg" : "border-line text-muted hover:text-fg"}`,
							children: m.label
						}, m.id))
					})]
				})
			})
		]
	});
}
function OndasPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FluidSim, {});
}
//#endregion
export { OndasPage as component };
