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
  if (name === "desktop" || name === "mobile") {
    const toolkitTrack = page.locator(".skills-scroll-track");
    const trackGeometry = await toolkitTrack.evaluate((el) => ({
      top: el.getBoundingClientRect().top + window.scrollY,
      distance: Math.max(el.offsetHeight - window.innerHeight, 1),
    }));
    const moveToToolkitProgress = async (progress) => {
      await page.evaluate(
        ({ top, distance, progress }) =>
          window.scrollTo({
            top: top + distance * progress,
            behavior: "instant",
          }),
        { ...trackGeometry, progress },
      );
      await page.waitForTimeout(650);
    };

    assert.equal(
      await page.locator(".skills-story-progress-segment").count(),
      5,
      `${name}: toolkit should show five progress segments`,
    );
    await moveToToolkitProgress(0.1);
    assert.equal(await page.locator(".skills-story-count").innerText(), "01 / 05");
    assert.equal(
      await page.locator(".skills-story-progress").getAttribute("aria-valuetext"),
      "1 of 5: Web Development",
    );
    assert.equal(
      await page.locator(".skills-story-next").innerText(),
      "Berikutnya: AI Integration",
    );
    await moveToToolkitProgress(0.3);
    assert.equal(await page.locator(".skills-story-count").innerText(), "02 / 05");
    assert.equal(
      await page.locator(".skills-story-progress").getAttribute("aria-valuetext"),
      "2 of 5: AI Integration",
    );
    assert.equal(
      await page.locator(".skills-story-next").innerText(),
      "Berikutnya: Data & Architecture",
    );
    await page.screenshot({ path: `.browser-tests/${name}-toolkit.png` });
    await moveToToolkitProgress(0.1);
    assert.equal(
      await page.locator(".skills-story-count").innerText(),
      "01 / 05",
      `${name}: toolkit order should reverse when scrolling up`,
    );
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
assert.equal(await reduced.locator(".skill-story-slide").count(), 5);
assert.equal(
  await reduced.locator(".skills-story-static-count").innerText(),
  "5 skill areas",
);
assert.equal(await reduced.locator(".skills-story-progress").count(), 0);
assert(
  await reduced
    .locator(".skill-story-slide")
    .evaluateAll((slides) => slides.every((el) => getComputedStyle(el).position === "relative")),
);
const animated = await browser.newPage({
  viewport: { width: 1440, height: 900 },
});
await animated.goto(process.env.TEST_URL || "http://127.0.0.1:5173", {
  waitUntil: "networkidle",
});
const toolkit = animated.locator(".skills-scroll-track");
const toolkitGeometry = await toolkit.evaluate((el) => ({
  top: el.getBoundingClientRect().top + window.scrollY,
  distance: Math.max(el.offsetHeight - window.innerHeight, 1),
}));
await animated.evaluate(
  ({ top, distance }) =>
    window.scrollTo({ top: top + distance * 0.3, behavior: "instant" }),
  toolkitGeometry,
);
await animated.waitForTimeout(700);
assert.equal(
  await animated
    .locator('.skills-story-progress[role="progressbar"]')
    .getAttribute("aria-valuetext"),
  "2 of 5: AI Integration",
  "Toolkit progress should update as the user scrolls",
);
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
  checks: "toolkit progress updates on scroll and project sticky scale is active",
});
results.push({
  name: "reduced-motion",
  checks: "toolkit skills remain readable in document flow without animated progress",
});
await browser.close();
writeFileSync(".browser-tests/results.json", JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
