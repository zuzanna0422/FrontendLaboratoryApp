const { test, expect } = require("@playwright/test");

const APP_URL = process.env.APP_URL || "http://localhost:3000";
const PROFILE_PATH = "/protected/user/profile";

test.describe("Przekierowanie niezalogowanego uzytkownika", () => {
  test("wejscie na profil bez logowania przekierowuje na formularz logowania", async ({
    page,
  }) => {
    await page.goto(`${APP_URL}${PROFILE_PATH}`);

    await expect(page).toHaveURL(/\/public\/user\/signin/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Logowanie/i);
  });
});
