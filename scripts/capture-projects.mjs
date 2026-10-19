import { chromium } from "@playwright/test";
import { mkdirSync, writeFileSync } from "node:fs";
mkdirSync(".browser-tests/captures", { recursive: true });
mkdirSync("public/projects", { recursive: true });
const browser = await chromium.launch({ headless: true });
for (const [name, url] of [
  ["nabungin", "https://nabungin-drab.vercel.app/"],
  ["zliritdo", "https://dickyandrean07.github.io/ZliritDO/"],
]) {
  const page = await browser.newPage({
    viewport: { width: 1280, height: 800 },
    deviceScaleFactor: 1,
  });
  const response = await page.goto(url, {
    waitUntil: "networkidle",
    timeout: 60000,
  });
  if (!response?.ok()) throw new Error(`${name}: ${response?.status()}`);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(2000);
  await page.screenshot({ path: `.browser-tests/captures/${name}.png` });
  console.log(name, response.status(), await page.title());
  await page.close();
}
await browser.close();
const path =
  "docs/07-handover/03-assets/screenshots/public/01_pub_homepage_hero_desktop.png";
const meta = await fetch(
  "https://api.github.com/repos/DickyAndrean07/proker-kkn/contents/" + path,
).then((r) => {
  if (!r.ok) throw new Error(String(r.status));
  return r.json();
});
const res = await fetch(meta.download_url);
if (!res.ok) throw new Error(String(res.status));
writeFileSync(
  ".browser-tests/captures/bendung.png",
  Buffer.from(await res.arrayBuffer()),
);
console.log("bendung", res.status, meta.download_url);
