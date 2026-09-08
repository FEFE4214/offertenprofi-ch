const { chromium } = require("playwright");

const BASE = "http://localhost:3000";

function log(step, ok, extra = "") {
  console.log(`${ok ? "✓" : "✗"} ${step}${extra ? " — " + extra : ""}`);
  if (!ok) process.exitCode = 1;
}

(async () => {
  const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  const uniq = Date.now();

  try {
    // Register a new customer
    await page.goto(`${BASE}/registrieren/kunde`);
    await page.fill('input[name="name"]', "Test Kunde");
    await page.fill('input[name="email"]', `test.kunde.${uniq}@example.ch`);
    await page.fill('input[name="password"]', "testpass123");
    await page.fill('input[name="plz"]', "3000");
    await page.fill('input[name="city"]', "Bern");
    await page.selectOption('select[name="canton"]', "BE");
    await page.click('button:has-text("Konto erstellen")');
    await page.waitForURL(`${BASE}/dashboard/kunde`, { timeout: 10000 });
    log("Kundenregistrierung erfolgreich", true);

    // Duplicate email should fail
    await page.goto(`${BASE}/registrieren/kunde`);
    await page.fill('input[name="name"]', "Test Kunde Zwei");
    await page.fill('input[name="email"]', `test.kunde.${uniq}@example.ch`);
    await page.fill('input[name="password"]', "testpass123");
    await page.fill('input[name="plz"]', "3000");
    await page.fill('input[name="city"]', "Bern");
    await page.selectOption('select[name="canton"]', "BE");
    await page.click('button:has-text("Konto erstellen")');
    await page.waitForTimeout(1000);
    const dupBody = await page.textContent("body");
    log("Duplikat-E-Mail wird abgelehnt", dupBody.includes("bereits registriert"));

    // Register a new craftsman
    await page.goto(`${BASE}/registrieren/handwerker`);
    await page.fill('input[name="name"]', "Test Handwerker");
    await page.fill('input[name="companyName"]', "Test Handwerker GmbH");
    await page.fill('input[name="email"]', `test.handwerker.${uniq}@example.ch`);
    await page.fill('input[name="password"]', "testpass123");
    await page.fill('input[name="plz"]', "9000");
    await page.fill('input[name="city"]', "St. Gallen");
    await page.selectOption('select[name="canton"]', "SG");
    await page.check('input[name="categories"] >> nth=0');
    await page.check('input[name="serviceAreas"][value="SG"]');
    await page.click('button:has-text("Kostenloses Profil erstellen")');
    await page.waitForURL(`${BASE}/dashboard/handwerker`, { timeout: 10000 });
    log("Handwerkerregistrierung erfolgreich", true);

    // Craftsman profile page loads and can be edited
    await page.goto(`${BASE}/dashboard/handwerker/profil`);
    await page.fill('textarea[name="bio"]', "Testbeschreibung fuer automatisierten Test.");
    await page.click('button:has-text("Speichern")');
    await page.waitForTimeout(1000);
    const profileBody = await page.textContent("body");
    log("Profil speichern erfolgreich", profileBody.includes("erfolgreich gespeichert"));

    // Mobile viewport check on homepage
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${BASE}/`);
    const menuButton = page.locator('button[aria-label="Menü öffnen"]');
    await menuButton.waitFor({ state: "visible", timeout: 5000 });
    await menuButton.click();
    await page.waitForTimeout(300);
    const mobileNavVisible = await page.locator('text=Gewerke').first().isVisible();
    log("Mobiles Menü öffnet korrekt", mobileNavVisible);

    console.log("\nRegistrierungs- und Mobile-Tests erfolgreich.");
  } catch (err) {
    console.error("FEHLER:", err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
