import { chromium } from "playwright";
import { readFileSync, writeFileSync } from "fs";
const browser = await chromium.launch();
for (const name of ["a","b","c"]) {
  const svg = readFileSync(`/workspace/.grok/fav/${name}.svg`, "utf8");
  for (const size of [16, 32, 64]) {
    const page = await browser.newPage({ viewport: { width: size, height: size }, deviceScaleFactor: 1 });
    const html = `<!DOCTYPE html><html><head><style>*{{margin:0;padding:0}}html,body,svg{{width:${size}px;height:${size}px;display:block}}</style></head><body>${svg}</body></html>`;
    await page.setContent(html);
    await page.waitForTimeout(30);
    await page.screenshot({ path: `/workspace/.grok/fav/${name}-${size}.png`, type: "png" });
    await page.close();
  }
}
await browser.close();
console.log("fav shots ok");
