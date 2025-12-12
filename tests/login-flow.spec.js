const { test, expect } = require("@playwright/test");

const APP_URL = process.env.APP_URL || "http://localhost:3000";
const TEST_EMAIL = process.env.PW_TEST_EMAIL;
const TEST_PASSWORD = process.env.PW_TEST_PASSWORD;
const PROFILE_PATH = "/protected/user/profile";

test.describe("Logowanie i przekierowanie do profilu", () => {
  test.skip(
    !TEST_EMAIL || !TEST_PASSWORD,
    "Ustaw PW_TEST_EMAIL i PW_TEST_PASSWORD w env, aby uruchomic test logowania."
  );

  test("po zalogowaniu trafia na profil uzytkownika", async ({ page }) => {
    await page.goto(
      `${APP_URL}/public/user/signin?returnUrl=${encodeURIComponent(PROFILE_PATH)}`
    );

    await page.getByLabel(/Email/i).fill(TEST_EMAIL);
    await page.getByLabel(/Haslo/i).fill(TEST_PASSWORD);
    await page.getByRole("button", { name: /Zaloguj/i }).click();

    await expect(page).toHaveURL(new RegExp(`${PROFILE_PATH}$`));
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Profil/i);
  });
});
