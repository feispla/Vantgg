import { chromium } from "playwright";
import { readFileSync } from "fs";
const names = ["thick","filled","notch","gem"];
const svgs = Object.fromEntries(names.map(n => [n, readFileSync(`/workspace/.grok/fav2/${n}.svg`,"utf8")]));
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 420, height: 120 }, deviceScaleFactor: 3 });
const cells = names.map(n => {
  const s = svgs[n];
  return `<div style="display:flex;flex-direction:column;align-items:center;gap:6px;color:#aaa;font:10px sans-serif">
    <div style="width:16px;height:16px;background:#111">${s.replace('<svg','<svg width="16" height="16"')}</div>
    <div style="width:32px;height:32px;background:#111">${s.replace('<svg','<svg width="32" height="32"')}</div>
    <div>${n}</div>
  </div>`;
}).join("");
await page.setContent(`<!DOCTYPE html><html><body style="margin:0;background:#333;display:flex;gap:24px;padding:16px;align-items:flex-end">${cells}</body></html>`);
await page.waitForTimeout(80);
await page.screenshot({ path: "/workspace/.grok/fav2-preview.png", type: "png" });
await browser.close();
console.log("ok");
