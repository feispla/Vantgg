import { r as __exportAll } from "../_runtime.mjs";
import { n as newId } from "./utils-DG8erAqy.mjs";
import { t as __exportAll$1 } from "./rolldown-runtime-D7D4PA-g.mjs";
import { r as getSql } from "./db-B12kHszo.mjs";
import { t as env } from "./env.server-wS9zOhV6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/email.server-DO3567x7.js
var email_server_DO3567x7_exports = /* @__PURE__ */ __exportAll({
	a: () => withTimeout,
	i: () => settleWithin,
	n: () => queueEmail,
	r: () => fetchWithTimeout,
	t: () => email_server_exports
});
var DEFAULT_MS = 2500;
async function fetchWithTimeout(input, init = {}, ms = DEFAULT_MS) {
	const ctrl = new AbortController();
	const outer = init.signal;
	const onAbort = () => ctrl.abort();
	if (outer) {
		if (outer.aborted) ctrl.abort();
		else outer.addEventListener("abort", onAbort, { once: true });
	}
	const timer = setTimeout(() => ctrl.abort(), ms);
	try {
		return await fetch(input, {
			...init,
			signal: ctrl.signal
		});
	} finally {
		clearTimeout(timer);
		outer?.removeEventListener("abort", onAbort);
	}
}
async function settleWithin(promise, ms = DEFAULT_MS) {
	let timer;
	try {
		return await Promise.race([promise.then((v) => v, () => null), new Promise((resolve) => {
			timer = setTimeout(() => resolve(null), ms);
		})]);
	} catch {
		return null;
	} finally {
		if (timer) clearTimeout(timer);
	}
}
function withTimeout(promise, ms = 8e3, message = "Tardó demasiado. Inténtalo de nuevo.") {
	return new Promise((resolve, reject) => {
		const timer = setTimeout(() => reject(new Error(message)), ms);
		promise.then((value) => {
			clearTimeout(timer);
			resolve(value);
		}, (err) => {
			clearTimeout(timer);
			reject(err);
		});
	});
}
var email_server_exports = /* @__PURE__ */ __exportAll$1({
	latestPreviewLink: () => latestPreviewLink,
	queueEmail: () => queueEmail
});
var SUBJECTS = {
	register: "Bienvenido a VANT",
	verify: "Verifica tu cuenta VANT",
	reset: "Restablece tu contraseña VANT",
	purchase: "Compra confirmada — VANT",
	ticket: "Tu ticket VANT",
	tournament: "Inscripción al torneo confirmada",
	inbound: "VANT · nuevo formulario"
};
async function queueEmail(input) {
	const sql = await getSql();
	const id = newId();
	const subject = SUBJECTS[input.template];
	const apiKey = env("RESEND_API_KEY");
	const from = env("EMAIL_FROM") ?? "VANT <noreply@vant.ltd>";
	let status = "preview";
	let error = null;
	if (apiKey) try {
		const res = await fetchWithTimeout("https://api.resend.com/emails", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${apiKey}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				from,
				to: [input.to],
				subject,
				text: input.body + (input.actionUrl ? `\n\n${input.actionUrl}` : "")
			})
		}, 2500);
		if (!res.ok) {
			error = `Resend ${res.status}`;
			status = "queued";
		} else status = "sent";
	} catch (err) {
		error = err instanceof Error ? err.message : "send_failed";
		status = "queued";
	}
	await sql`
    insert into email_outbox (id, to_email, template, subject, body, action_url, status, error)
    values (
      ${id},
      ${input.to},
      ${input.template},
      ${subject},
      ${input.body},
      ${input.actionUrl ?? null},
      ${status},
      ${error}
    )
  `;
	return {
		id,
		status,
		actionUrl: input.actionUrl ?? null,
		delivered: status === "sent"
	};
}
async function latestPreviewLink(email, template) {
	return (await (await getSql())`
    select action_url, created_at, status
    from email_outbox
    where to_email = ${email} and template = ${template}
    order by created_at desc
    limit 1
  `)[0] ?? null;
}
//#endregion
export { withTimeout as a, settleWithin as i, fetchWithTimeout as n, queueEmail as r, email_server_DO3567x7_exports as t };
