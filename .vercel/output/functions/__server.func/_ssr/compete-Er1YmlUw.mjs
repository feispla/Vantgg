import { F as object, P as number, R as string, k as array } from "../_libs/@better-auth/core+[...].mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-BcQDlf_O.mjs";
import { r as createSsrRpc } from "./profiles-D-Lv5pW_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/compete-Er1YmlUw.js
var getRankedBoard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("ea2c23950c9c60563a0c35201182234662c07c83d2510ef0f3c335f11d9a082c"));
var listTournaments = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("8066898a3074d182ab5cf2bb038169288502edd708c176ecad6797becdb236cc"));
var getPrivateTournament = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("f64879c1f1017d7b4ed4c282c47dfb42c717338f85c7ac0648f41dbcac518761"));
var registerForTournament = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({ tournamentId: string().min(2).max(80) })).handler(createSsrRpc("e2a1686076b43e5c6482bd531e3769c5b39c27dc1852a09f9d614f44b04bdda3"));
var startRankedQueue = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(createSsrRpc("954d99dacb06f930638f189333832e5044ce4ed4e81fa71cf8c84f1cc7498956"));
var submitRankedMatch = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator(object({
	matchId: string().min(8).max(80),
	times: array(number().nullable()).min(3).max(5)
})).handler(createSsrRpc("97d8bc4449e8adf7f196afae7917144385783303082d3f0feb80126b948c940c"));
//#endregion
export { startRankedQueue as a, registerForTournament as i, getRankedBoard as n, submitRankedMatch as o, listTournaments as r, getPrivateTournament as t };
