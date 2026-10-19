import { chromium } from "@playwright/test";
import assert from "node:assert/strict";
import { mkdirSync, writeFileSync } from "node:fs";
const browser = await chromium.launch({ headless: true });
mkdirSync(".browser-tests", { recursive: true });
const results = [];
for (const [name, width, height] of [
  ["desktop", 1440, 900],
  ["tablet", 768, 1024],
  ["mobile", 390, 844],
  ["small-mobile", 320, 640],
]) {
  const page = await browser.newPage({ viewport: { width, height } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(process.env.TEST_URL || "http://127.0.0.1:5173", {
    waitUntil: "networkidle",
  });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1200);
  assert.equal(await page.locator("h1").innerText(), "HI, I'M DICKY");
  assert.equal(await page.locator(".project-card").count(), 4);
  assert.equal(await page.locator(".project-links a").count(), 6);
  assert.equal(await page.locator(".live-button").count(), 2);
  for (const repo of ["nabungin", "ZliritDO", "proker-kkn", "pancokuy"]) {
    assert.equal(
      await page
        .locator(
          `.project-links a[href="https://github.com/DickyAndrean07/${repo}"]`,
        )
        .count(),
      1,
    );
  }
  for (const img of await page.locator(".project-preview img").all()) {
    await img.scrollIntoViewIfNeeded();
    await img.evaluate((img) => img.decode());
    assert(await img.evaluate((img) => img.naturalWidth > 0));
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForTimeout(400);
  const titleFits = await page.locator("h1").evaluate((el) => {
    const range = document.createRange();
    range.selectNodeContents(el);
    const text = range.getBoundingClientRect(),
      box = el.getBoundingClientRect();
    return text.left >= box.left - 1 && text.right <= box.right + 1;
  });
  assert(titleFits, `${name}: hero heading must fit inside its container`);
  assert(
    await page
      .locator(".portrait")
      .evaluate((img) => img.complete && img.naturalWidth > 0),
  );
  await page.screenshot({ path: `.browser-tests/${name}-hero.png` });
  for (const id of ["about", "skills", "projects", "contact"]) {
    await page.locator(`#${id}`).scrollIntoViewIfNeeded();
    await page.waitForTimeout(850);
    assert(await page.locator(`#${id}`).isVisible());
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    );
    assert(!overflow, `${name} overflow at ${id}`);
  }
  await page.locator('nav a[href="#projects"]').click();
  await page.waitForTimeout(1200);
  assert.equal(new URL(page.url()).hash, "#projects");
  await page.locator(".project-card").first().scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  await page.screenshot({ path: `.browser-tests/${name}-projects.png` });
  const downloadPromise = page.waitForEvent("download");
  await page.locator("a[download]").click();
  const download = await downloadPromise;
  assert.equal(download.suggestedFilename(), "M-Dicky-Andrean-CV.pdf");
  const cv = await page.request.get(
    new URL("/M-Dicky-Andrean-CV.pdf", page.url()).href,
  );
  assert.equal(cv.status(), 200);
  assert((await cv.body()).subarray(0, 4).toString() === "%PDF");
  assert.equal(
    await page.locator('a[href="mailto:karangsawo123@gmail.com"]').count(),
    2,
  );
  assert.equal(errors.length, 0, errors.join("\n"));
  results.push({
    name,
    width,
    height,
    errors,
    checks:
      "render, portrait, 4 projects, anchors, overflow, CV download, mail links",
  });
  await page.close();
}
const reduced = await browser.newPage({
  reducedMotion: "reduce",
  viewport: { width: 390, height: 844 },
});
await reduced.goto(process.env.TEST_URL || "http://127.0.0.1:5173");
assert.equal(
  await reduced
    .locator(".project-card")
    .first()
    .evaluate((el) => getComputedStyle(el).position),
  "relative",
);
assert(
  (await reduced.locator(".about-copy").innerText()).includes("Saya Dicky"),
);
assert.equal(await reduced.locator(".about-copy .word").count(), 0);
const animated = await browser.newPage({
  viewport: { width: 1440, height: 900 },
});
await animated.goto(process.env.TEST_URL || "http://127.0.0.1:5173", {
  waitUntil: "networkidle",
});
const before = await animated
  .locator(".marquee-row")
  .first()
  .evaluate((el) => getComputedStyle(el).transform);
await animated.evaluate(() =>
  window.scrollTo({ top: 1000, behavior: "instant" }),
);
await animated.waitForTimeout(300);
const after = await animated
  .locator(".marquee-row")
  .first()
  .evaluate((el) => getComputedStyle(el).transform);
assert.notEqual(before, after, "Marquee should respond to scrolling");
await animated.locator(".project-card").nth(2).scrollIntoViewIfNeeded();
await animated.waitForTimeout(500);
assert.equal(
  await animated
    .locator(".project-card")
    .first()
    .evaluate((el) => getComputedStyle(el).position),
  "sticky",
);
assert.notEqual(
  await animated
    .locator(".project-card")
    .first()
    .evaluate((el) => getComputedStyle(el).transform),
  "none",
);
results.push({
  name: "scroll-animation",
  checks: "marquee transform changes and project sticky scale active",
});
results.push({
  name: "reduced-motion",
  checks: "non-sticky cards and readable about text",
});
await browser.close();
writeFileSync(".browser-tests/results.json", JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
