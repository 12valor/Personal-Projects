const { chromium } = require("playwright");
const fs = require("node:fs/promises");
const path = require("node:path");

const projects = [
  {
    name: "Portfolio",
    slug: "portfolio-mvp",
    url: "http://localhost:3000",
  },
  {
    name: "TUPV",
    slug: "tupv-mvp",
    url: "http://127.0.0.1:8080/TUPV%20Website/landing.html",
  },
  {
    name: "Technowatch",
    slug: "technowatch-mvp",
    url: "http://127.0.0.1:8080/Technowatch%20Website/index.html",
  },
  {
    name: "8K IoT",
    slug: "8k-iot-mvp",
    url: "http://localhost:3001",
  },
];

const outputDirectory = path.resolve(
  __dirname,
  "..",
  "README-assets",
  "screenshots",
);

const stabilizationStyles = `
  *,
  *::before,
  *::after {
    animation: none !important;
    animation-delay: 0s !important;
    animation-duration: 0s !important;
    transition: none !important;
    transition-delay: 0s !important;
    transition-duration: 0s !important;
    caret-color: transparent !important;
  }

  html {
    scroll-behavior: auto !important;
    scrollbar-width: none !important;
  }

  body {
    scrollbar-width: none !important;
  }

  html::-webkit-scrollbar,
  body::-webkit-scrollbar,
  *::-webkit-scrollbar {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
  }
`;

const delay = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

function isPlaceholderUrl(url) {
  return !/^https?:\/\//i.test(url) || url.includes("PUT_");
}

async function waitForPageAssets(page) {
  await page.evaluate(async () => {
    if (document.fonts?.ready) {
      await document.fonts.ready;
    }

    const images = Array.from(document.images);
    const imageLoading = Promise.all(
      images.map(
        (image) =>
          image.complete ||
          new Promise((resolve) => {
            image.addEventListener("load", resolve, { once: true });
            image.addEventListener("error", resolve, { once: true });
          }),
      ),
    );

    await Promise.race([
      imageLoading,
      new Promise((resolve) => setTimeout(resolve, 15_000)),
    ]);
  });
}

async function captureProject(browser, project) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  try {
    console.log(`Capturing ${project.name}: ${project.url}`);

    await page.addInitScript((styles) => {
      document.addEventListener(
        "DOMContentLoaded",
        () => {
          const style = document.createElement("style");
          style.dataset.screenshotStabilization = "true";
          style.textContent = styles;
          document.documentElement.appendChild(style);
        },
        { once: true },
      );
    }, stabilizationStyles);
    await page.goto(project.url, {
      waitUntil: "domcontentloaded",
      timeout: 90_000,
    });
    await page
      .waitForLoadState("networkidle", { timeout: 30_000 })
      .catch(() =>
        console.warn(
          `${project.name} kept network requests open; continuing after DOM load.`,
        ),
      );
    await page.addStyleTag({ content: stabilizationStyles });
    await waitForPageAssets(page);
    await page.evaluate(() => window.scrollTo(0, 0));
    await delay(750);

    const outputPath = path.join(outputDirectory, `${project.slug}.png`);
    await page.screenshot({
      path: outputPath,
      fullPage: false,
      animations: "disabled",
    });

    console.log(`Saved ${path.relative(process.cwd(), outputPath)}`);
  } finally {
    await context.close();
  }
}

async function main() {
  const requestedSlugs = new Set(process.argv.slice(2));
  const configuredProjects = projects.filter(
    (project) =>
      !isPlaceholderUrl(project.url) &&
      (requestedSlugs.size === 0 || requestedSlugs.has(project.slug)),
  );
  const skippedProjects = projects.filter((project) =>
    isPlaceholderUrl(project.url),
  );

  for (const project of skippedProjects) {
    console.warn(
      `Skipping ${project.name}: replace "${project.url}" with a full http(s) URL.`,
    );
  }

  if (configuredProjects.length === 0) {
    console.warn("No project URLs are configured. No screenshots were captured.");
    return;
  }

  await fs.mkdir(outputDirectory, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const failures = [];

  try {
    for (const project of configuredProjects) {
      try {
        await captureProject(browser, project);
      } catch (error) {
        failures.push(project.name);
        console.error(`Failed to capture ${project.name}:`, error);
      }
    }
  } finally {
    await browser.close();
  }

  if (failures.length > 0) {
    throw new Error(`Screenshot capture failed for: ${failures.join(", ")}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
