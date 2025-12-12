const { test, expect } = require("@playwright/test");

test("ma link do strony logowania", async ({ page }) => {
  await page.goto("http://localhost:3000/");

  await page.getByRole("link", { name: /Logowanie/i }).click();

  await expect(page).toHaveURL(/\/public\/user\/signin/);

  await expect(page.locator("h1")).toContainText("Logowanie");
});
