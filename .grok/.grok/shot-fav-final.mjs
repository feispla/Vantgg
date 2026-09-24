import { chromium } from "playwright";
import { readFileSync } from "fs";
const svg = readFileSync("/workspace/.grok/favicon.svg.tmp", "utf8");
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 200, height: 80 }, deviceScaleFactor: 2 });
await page.setContent(`<!DOCTYPE html>
<html><head><style>
  html,body{margin:0;background:#333;width:200px;height:80px}
  .row{display:flex;gap:12px;align-items:center;padding:12px}
  .box{background:#111;display:flex}
</style></head>
<body>
  <div class="row">
    <div class="box" style="width:16px;height:16px">${svg.replace('<svg', '<svg width="16" height="16"')}</div>
    <div class="box" style="width:32px;height:32px">${svg.replace('<svg', '<svg width="32" height="32"')}</div>
    <div class="box" style="width:64px;height:64px">${svg.replace('<svg', '<svg width="64" height="64"')}</div>
  </div>
</body></html>`);
await page.waitForTimeout(80);
await page.screenshot({ path: "/workspace/.grok/fav-preview.png", type: "png" });
await browser.close();
console.log("preview ok");
