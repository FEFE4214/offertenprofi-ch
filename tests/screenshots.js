const { chromium } = require("playwright");
(async () => {
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto("http://localhost:3000/");
  await page.waitForTimeout(500);
  await page.screenshot({ path: "/tmp/shot-home.png", fullPage: false });

  await page.goto("http://localhost:3000/handwerker");
  await page.waitForTimeout(500);
  await page.screenshot({ path: "/tmp/shot-search.png", fullPage: false });

  await page.goto("http://localhost:3000/login");
  await page.fill('input[name="email"]', "anna.meier@example.ch");
  await page.fill('input[name="password"]', "demo1234");
  await page.click('button[type="submit"]');
  await page.waitForURL("http://localhost:3000/dashboard/kunde");
  await page.waitForTimeout(500);
  await page.screenshot({ path: "/tmp/shot-dashboard.png", fullPage: false });

  await browser.close();
  console.log("done");
})();
