const { chromium } = require("playwright");
const fs = require("node:fs/promises");
const path = require("node:path");

const projects = [
  {
    name: "Portfolio",
    slug: "portfolio",
    url: "PUT_PORTFOLIO_URL_HERE",
  },
  {
    name: "TUPV",
    slug: "tupv",
    url: "PUT_TUPV_URL_HERE",
  },
  {
    name: "Technowatch",
    slug: "technowatch",
    url: "PUT_TECHNOWATCH_URL_HERE",
  },
  {
    name: "8K IoT",
    slug: "8k-iot",
    url: "PUT_8K_IOT_URL_HERE",
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

async function scrollThroughPage(page) {
  await page.evaluate(async () => {
    const pause = (milliseconds) =>
      new Promise((resolve) => setTimeout(resolve, milliseconds));
    const step = Math.max(Math.floor(window.innerHeight * 0.75), 500);

    for (let position = 0; position < document.body.scrollHeight; position += step) {
      window.scrollTo(0, position);
      await pause(150);
    }

    window.scrollTo(0, document.body.scrollHeight);
    await pause(300);
    window.scrollTo(0, 0);
  });
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
    viewport: { width: 1440, height: 1200 },
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
      waitUntil: "networkidle",
      timeout: 90_000,
    });
    await page.addStyleTag({ content: stabilizationStyles });
    await scrollThroughPage(page);
    await page.waitForLoadState("networkidle", { timeout: 30_000 });
    await page.addStyleTag({ content: stabilizationStyles });
    await waitForPageAssets(page);
    await page.evaluate(() => window.scrollTo(0, 0));
    await delay(750);

    const outputPath = path.join(outputDirectory, `${project.slug}.png`);
    await page.screenshot({
      path: outputPath,
      fullPage: true,
      animations: "disabled",
    });

    console.log(`Saved ${path.relative(process.cwd(), outputPath)}`);
  } finally {
    await context.close();
  }
}

async function main() {
  const configuredProjects = projects.filter(
    (project) => !isPlaceholderUrl(project.url),
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
