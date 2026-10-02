import { expect, test } from "@playwright/test";
import { articleImages } from "../lib/article-images";

test("uses the supplied Cleos logo in the header, footer, and tab", async ({ page }) => {
  await page.goto("./");
  await expect(page.locator(".brand-logo")).toHaveAttribute("src", /\/cleos-logo\.png$/);
  await expect(page.locator(".footer-logo")).toHaveAttribute("src", /\/cleos-logo\.png$/);
  await expect(page.locator('link[rel="icon"]')).toHaveAttribute("href", /\/icon\.png/);
  await expect.poll(() => page.locator(".brand-logo").evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
});

test("home makes every topic reachable", async ({ page }) => {
  await page.goto("./");
  await expect(page.getByRole("heading", { name: "All topics", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: /good care starts/i })).toHaveCount(0);
  await expect(page.locator(".index-category")).toHaveCount(10);
  await expect(page.locator(".index-group li a")).toHaveCount(62);
  await expect(page.getByRole("complementary", { name: "Help topics" }).getByRole("link")).toHaveCount(10);
  await page.getByRole("complementary", { name: "Help topics" }).getByRole("link", { name: "Patients" }).click();
  await expect(page.getByRole("heading", { name: "Patients", exact: true })).toBeVisible();
  await page.getByRole("link", { name: /create a patient record/i }).click();
  await expect(page.getByRole("heading", { name: "Create a patient record" })).toBeVisible();
  await expect(page.locator(".steps li")).toHaveCount(3);
});

test("search finds an article and supports Enter", async ({ page }) => {
  await page.goto("./");
  const search = page.getByRole("searchbox", { name: "Search Cleos Help Centre articles" });
  await search.fill("prescription");
  await expect(page.locator(".search-results a").first()).toBeVisible();
  await search.press("Enter");
  await expect(page.getByRole("heading", { name: /prescription/i }).first()).toBeVisible();
});

test("search has a useful empty state and keyboard focus", async ({ page }, testInfo) => {
  await page.goto("./");
  await page.waitForLoadState("networkidle");
  await page.keyboard.press("Control+k");
  const search = page.getByRole("searchbox", { name: "Search Cleos Help Centre articles" });
  await expect(search).toBeFocused();
  await search.fill("zzzz-no-match");
  await expect(page.getByText(/No results for/)).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(search).toHaveValue("");
  await page.screenshot({ path: testInfo.outputPath("home.png"), fullPage: true });
});

test("direct article URL, breadcrumbs, and related links work", async ({ page }, testInfo) => {
  await page.goto("./articles/add-or-update-a-prescription/");
  await expect(page.getByRole("heading", { name: "Add or update a prescription" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Breadcrumb" }).getByRole("link", { name: "Prescribing and dispensing" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Good to know" })).toBeVisible();
  await page.screenshot({ path: testInfo.outputPath("article.png"), fullPage: true });
});

test("page has no horizontal overflow", async ({ page }) => {
  await page.goto("./topics/manage-your-clinic/");
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
  expect(overflow).toBe(false);
  await page.goto("./");
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)).toBe(false);
});

test("unknown article returns a useful 404", async ({ page }) => {
  const response = await page.goto("./articles/this-does-not-exist/");
  expect(response?.status()).toBe(404);
});

test("mobile menu exposes all topic groups", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");
  await page.goto("./");
  await page.locator(".mobile-menu summary").click();
  const menu = page.getByRole("navigation", { name: "Mobile navigation" });
  await expect(menu.getByRole("link")).toHaveCount(11);
  await menu.getByRole("link", { name: "Manage your clinic" }).click();
  await expect(page.getByRole("heading", { name: "Manage your clinic" })).toBeVisible();
});

test("search results remain visible below the index search", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile");
  await page.goto("./");
  await page.getByRole("searchbox").fill("payment");
  await expect(page.locator(".search-results a")).toHaveCount(7);
  await page.screenshot({ path: testInfo.outputPath("search-open.png") });
});

test("navigation opens the next page at its beginning", async ({ page }) => {
  await page.goto("./topics/prescribing-and-dispensing/");
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.getByRole("link", { name: /add or update a prescription/i }).click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toBeInViewport();
});

test("theme follows the device until a choice is saved", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("./");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.getByRole("button", { name: "Switch to light mode" })).toBeVisible();
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expect(page.getByRole("button", { name: "Switch to dark mode" })).toBeVisible();
});

test("theme toggle persists across pages and reloads", async ({ page }, testInfo) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("./");
  const toggle = page.getByRole("button", { name: "Switch to dark mode" });
  await expect(toggle).toBeVisible();
  await toggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.getByRole("button", { name: "Switch to light mode" })).toHaveAttribute("aria-pressed", "true");
  if (testInfo.project.name !== "tablet") {
    await page.screenshot({ path: testInfo.outputPath("dark-home.png"), fullPage: true });
  }
  await page.getByRole("link", { name: /a single visit, start to finish/i }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)).toBe(false);
  if (testInfo.project.name !== "tablet") {
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({ path: testInfo.outputPath("dark-article.png"), fullPage: true });
  }
});

test("theme toggle works from the keyboard", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("./");
  const toggle = page.getByRole("button", { name: "Switch to dark mode" });
  await toggle.focus();
  await expect(toggle).toBeFocused();
  await toggle.press("Space");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("dark mode covers topics, screenshot guides, and mobile navigation", async ({ page }, testInfo) => {
  await page.goto("./");
  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  await page.goto("./topics/patients/");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.getByRole("heading", { name: "Patients", exact: true })).toBeVisible();
  await page.goto("./articles/book-an-appointment/");
  const image = page.locator("#visual-guide img");
  await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)).toBe(false);
  if (testInfo.project.name === "mobile") {
    await page.locator(".mobile-menu summary").click();
    await expect(page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "All topics" })).toBeVisible();
  }
});

for (const [slug, file] of [
  ["find-a-patient-before-creating-a-record", "patients-list.jpg"],
  ["create-a-patient-record", "create-patient.jpg"],
  ["add-a-patient-to-the-queue", "patients-list.jpg"],
  ["book-an-appointment", "book-appointment.png"],
  ["maintain-item-and-service-details", "inventory.jpg"],
  ["record-stock-movements-and-adjustments", "stock-adjustment.png"],
]) {
  test(`visual guide loads on ${slug}`, async ({ page }, testInfo) => {
    await page.goto(`./articles/${slug}/`);
    const visual = page.locator("#visual-guide");
    await expect(visual.getByRole("heading", { name: "Visual guide" })).toBeVisible();
    const image = visual.locator(`img[src$="/screens/${file}"]`);
    await expect(image).toHaveAttribute("alt", /.+/);
    await expect(image).toHaveAttribute("src", new RegExp(`/screens/${file}`));
    await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
    await expect(visual.locator("figcaption").first()).toBeVisible();
    await expect(visual.locator(".screenshot-trigger").first()).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)).toBe(false);
    if (slug === "create-a-patient-record" && testInfo.project.name === "desktop") {
      await page.screenshot({ path: testInfo.outputPath("visual-guide.png"), fullPage: true });
    }
  });
}

test("expanded screenshot guides load across article topics", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop");
  test.setTimeout(120_000);
  expect(Object.keys(articleImages).length).toBeGreaterThanOrEqual(35);
  for (const [slug, images] of Object.entries(articleImages)) {
    await page.goto(`./articles/${slug}/`);
    const visual = page.locator("#visual-guide");
    await expect(visual.locator(".screenshot-figure")).toHaveCount(images.length);
    for (const [index, expected] of images.entries()) {
      const figure = visual.locator(".screenshot-figure").nth(index);
      await expect(figure.getByRole("img")).toHaveAttribute("alt", expected.alt);
      await expect(figure.getByRole("button", { name: `View screenshot: ${expected.alt}` })).toBeVisible();
      await expect.poll(() => figure.getByRole("img").evaluate((image: HTMLImageElement) => image.complete && image.naturalWidth > 0)).toBe(true);
    }
  }
});

test("queue guide shows both entry points, with Queue first", async ({ page }) => {
  await page.goto("./articles/add-a-patient-to-the-queue/");
  const steps = page.locator(".doc-main .steps > li");
  await expect(steps.first()).toContainText("From Queue");
  await expect(steps.nth(2)).toContainText("Alternatively, open Patients");
  const screenshots = page.locator("#visual-guide .screenshot-figure img");
  await expect(screenshots.first()).toHaveAttribute("src", /queue-test-full\.png$/);
  await expect(screenshots.nth(1)).toHaveAttribute("src", /patients-list\.jpg$/);
});

test("screenshot opens in-site, zooms, pans, and returns focus", async ({ page }, testInfo) => {
  await page.goto("./articles/find-your-way-around-cleos/");
  const originalUrl = page.url();
  const first = page.locator(".screenshot-trigger").first();
  const second = page.locator(".screenshot-trigger").nth(1);
  const downloads: string[] = [];
  page.on("download", (download) => downloads.push(download.suggestedFilename()));
  await first.click();
  const viewer = page.getByRole("dialog", { name: "Screenshot viewer" });
  await expect(viewer).toBeVisible();
  await expect(viewer.getByRole("img")).toHaveAttribute("src", /patients-list\.jpg$/);
  await expect.poll(() => viewer.getByRole("img").evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
  await expect(viewer.getByRole("button", { name: "Close screenshot viewer" })).toBeFocused();
  await viewer.getByRole("button", { name: "Zoom in" }).click();
  await expect(viewer.getByRole("button", { name: "Reset zoom" })).toHaveText("125%");
  await viewer.locator(".viewer-stage").hover();
  await page.mouse.wheel(0, -400);
  await expect(viewer.getByRole("button", { name: "Reset zoom" })).not.toHaveText("125%");
  await viewer.getByRole("button", { name: "Zoom in" }).click();
  await viewer.getByRole("button", { name: "Zoom in" }).click();
  const stage = viewer.locator(".viewer-stage");
  const beforePan = await viewer.getByRole("img").getAttribute("style");
  const bounds = await stage.boundingBox();
  expect(bounds).not.toBeNull();
  await page.mouse.move(bounds!.x + bounds!.width / 2, bounds!.y + bounds!.height / 2);
  await page.mouse.down();
  await page.mouse.move(bounds!.x + bounds!.width / 2 + 65, bounds!.y + bounds!.height / 2 + 65);
  await page.mouse.up();
  expect(await viewer.getByRole("img").getAttribute("style")).not.toBe(beforePan);
  expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)).toBe(false);
  await viewer.getByRole("button", { name: "Next screenshot" }).click();
  await expect(viewer.getByRole("img")).toHaveAttribute("src", /reports\.png$/);
  await expect(viewer.getByRole("button", { name: "Reset zoom" })).toHaveText("100%");
  await viewer.getByRole("button", { name: "Previous screenshot" }).click();
  await expect(viewer.getByRole("img")).toHaveAttribute("src", /patients-list\.jpg$/);
  await page.keyboard.press("Escape");
  await expect(viewer).not.toBeVisible();
  await expect(first).toBeFocused();
  expect(page.url()).toBe(originalUrl);
  expect(downloads).toEqual([]);
  await second.focus();
  await second.press("Enter");
  await expect(viewer).toBeVisible();
  await viewer.getByRole("button", { name: "Close screenshot viewer" }).click();
  await expect(second).toBeFocused();
  if (testInfo.project.name !== "tablet") {
    await first.click();
    await page.screenshot({ path: testInfo.outputPath("image-viewer.png") });
  }
});

for (const [slug, count] of [
  ["a-single-visit-start-to-finish", 3],
  ["understand-waiting-in-progress-in-dispensary-and-completed", 4],
  ["add-or-update-a-prescription", 3],
  ["review-an-invoice", 3],
] as const) {
  test(`workflow diagram is clear on ${slug}`, async ({ page }, testInfo) => {
    await page.goto(`./articles/${slug}/`);
    const visual = page.locator("#visual-guide");
    await expect(visual.getByRole("heading", { name: "Visual guide" })).toBeVisible();
    await expect(visual.locator(".diagram-steps li")).toHaveCount(count);
    await expect(visual.getByText("Workflow illustration, not a Cleos screen.")).toHaveCount(0);
    expect(await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)).toBe(false);
    if (slug === "a-single-visit-start-to-finish" && testInfo.project.name === "desktop") {
      await page.screenshot({ path: testInfo.outputPath("clinic-flow.png"), fullPage: true });
    }
  });
}
