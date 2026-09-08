const { chromium } = require("playwright");

const BASE = "http://localhost:3000";

function log(step, ok, extra = "") {
  console.log(`${ok ? "✓" : "✗"} ${step}${extra ? " — " + extra : ""}`);
  if (!ok) process.exitCode = 1;
}

(async () => {
  const browser = await chromium.launch({
    executablePath: "/opt/pw-browsers/chromium",
  });

  const customerCtx = await browser.newContext();
  const craftsmanCtx = await browser.newContext();
  const customer = await customerCtx.newPage();
  const craftsman = await craftsmanCtx.newPage();

  const jobTitle = `E2E Test Auftrag ${Date.now()}`;

  try {
    // 1. Customer login
    await customer.goto(`${BASE}/login`);
    await customer.fill('input[name="email"]', "anna.meier@example.ch");
    await customer.fill('input[name="password"]', "demo1234");
    await customer.click('button[type="submit"]');
    await customer.waitForURL(`${BASE}/dashboard/kunde`, { timeout: 10000 });
    log("Kunde Login -> /dashboard/kunde", true);

    // 2. Post a new job
    await customer.goto(`${BASE}/auftrag-erstellen`);
    await customer.selectOption('select[name="categoryId"]', { label: "Elektriker" });
    await customer.fill('input[name="title"]', jobTitle);
    await customer.fill(
      'textarea[name="description"]',
      "Dies ist ein automatisch erstellter Testauftrag fuer den End-to-End Test der Plattform."
    );
    await customer.fill('input[name="plz"]', "8001");
    await customer.fill('input[name="city"]', "Zuerich");
    await customer.selectOption('select[name="canton"]', "ZH");
    await customer.fill('input[name="budgetMin"]', "500");
    await customer.fill('input[name="budgetMax"]', "1000");
    await customer.click('button:has-text("Auftrag kostenlos veröffentlichen")');
    await customer.waitForURL(/\/dashboard\/kunde\/auftrag\//, { timeout: 10000 });
    const jobUrl = customer.url();
    const jobId = jobUrl.split("/").pop();
    log("Auftrag erstellt", true, jobId);

    const bodyAfterPost = await customer.textContent("body");
    log("Auftragstitel sichtbar im Detail", bodyAfterPost.includes(jobTitle));

    // 3. Craftsman login (Stefan Keller does Elektriker)
    await craftsman.goto(`${BASE}/login`);
    await craftsman.fill('input[name="email"]', "stefan.keller@example.ch");
    await craftsman.fill('input[name="password"]', "demo1234");
    await craftsman.click('button[type="submit"]');
    await craftsman.waitForURL(`${BASE}/dashboard/handwerker`, { timeout: 10000 });
    log("Handwerker Login -> /dashboard/handwerker", true);

    // 4. Craftsman sees the new job in feed
    await craftsman.goto(`${BASE}/dashboard/handwerker`);
    const feedText = await craftsman.textContent("body");
    log("Neuer Auftrag im Handwerker-Feed sichtbar", feedText.includes(jobTitle));

    // 5. Craftsman opens job & submits offer
    await craftsman.goto(`${BASE}/dashboard/handwerker/auftrag/${jobId}`);
    await craftsman.fill('input[name="price"]', "850");
    await craftsman.fill('textarea[name="message"]', "Wir koennen den Auftrag naechste Woche erledigen.");
    await craftsman.fill('input[name="estimatedDuration"]', "1 Tag");
    await craftsman.click('button:has-text("Angebot abgeben")');
    await craftsman.waitForTimeout(1500);
    const offerPageText = await craftsman.textContent("body");
    log("Angebot abgegeben (Status sichtbar)", offerPageText.includes("Ausstehend") || offerPageText.includes("CHF 850"));

    // 6. Customer sees offer and accepts it
    await customer.goto(jobUrl);
    await customer.waitForTimeout(500);
    let custBody = await customer.textContent("body");
    log("Angebot beim Kunden sichtbar", custBody.includes("Stefan Keller") || custBody.includes("Keller Elektro"));

    const craftsmanProfileHref = await customer
      .locator('a[href^="/handwerker/"]')
      .first()
      .getAttribute("href");

    const acceptButton = customer.locator('button:has-text("Angebot annehmen")').first();
    await acceptButton.click();
    await customer.waitForTimeout(1000);
    custBody = await customer.textContent("body");
    log("Angebot angenommen (Status In Bearbeitung)", custBody.includes("In Bearbeitung"));

    // 7. Customer marks job complete
    const completeButton = customer.locator('button:has-text("Als abgeschlossen markieren")').first();
    await completeButton.click();
    await customer.waitForTimeout(1000);
    custBody = await customer.textContent("body");
    log("Auftrag abgeschlossen", custBody.includes("Abgeschlossen"));

    // 8. Customer leaves a review
    const stars = customer.locator('button[aria-label="5 Sterne"]');
    await stars.click();
    await customer.fill('textarea[name="comment"]', "Sehr zufrieden, schnelle und saubere Arbeit!");
    await customer.click('button:has-text("Bewertung abgeben")');
    await customer.waitForTimeout(1000);
    custBody = await customer.textContent("body");
    log("Bewertung abgegeben", custBody.includes("Sehr zufrieden"));

    // 9. Verify review shows on craftsman public profile
    await customer.goto(`${BASE}${craftsmanProfileHref}`);
    const profileBody = await customer.textContent("body");
    log("Bewertung auf oeffentlichem Profil sichtbar", profileBody.includes("Sehr zufrieden"));

    // 10. Craftsman offers list shows accepted offer
    await craftsman.goto(`${BASE}/dashboard/handwerker/angebote`);
    const offersListText = await craftsman.textContent("body");
    log("Angebot in Handwerker-Uebersicht mit Status Angenommen", offersListText.includes("Angenommen"));

    console.log("\nAlle Kernflows erfolgreich getestet.");
  } catch (err) {
    console.error("FEHLER:", err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
})();
