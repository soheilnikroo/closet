import { expect, test, type Page } from "@playwright/test";

async function mockProductApis(page: Page) {
  await page.route("**/v1/**", async (route) => {
    const url = route.request().url();
    const method = route.request().method();

    if (url.includes("/users/me/profile") && method === "GET") {
      return route.fulfill({
        json: {
          profile: {
            userId: "00000000-0000-4000-8000-000000000001",
            cityId: null,
            currency: "IRR",
            temperaturePreference: "celsius",
            preferredLanguage: "en-GB",
            onboardingCompleted: false,
            onboardingStep: "welcome",
            createdAt: "2026-11-01T10:00:00.000Z",
            updatedAt: "2026-11-01T10:00:00.000Z",
          },
        },
      });
    }

    if (url.includes("/users/me/profile") && method === "PATCH") {
      return route.fulfill({
        json: {
          profile: {
            userId: "00000000-0000-4000-8000-000000000001",
            cityId: null,
            currency: "IRR",
            temperaturePreference: "celsius",
            preferredLanguage: "en-GB",
            onboardingCompleted: false,
            onboardingStep: "styles",
            createdAt: "2026-11-01T10:00:00.000Z",
            updatedAt: "2026-11-01T10:00:00.000Z",
          },
        },
      });
    }

    if (url.includes("/users/me/style-profile")) {
      return route.fulfill({
        json: {
          styleProfile: {
            userId: "00000000-0000-4000-8000-000000000001",
            preferredStyles: ["casual"],
            preferredFits: [],
            dislikedFits: [],
            preferredColors: [],
            dislikedColors: [],
            comfortPriority: null,
            lifestylePreferences: [],
            updatedAt: "2026-11-01T10:00:00.000Z",
          },
        },
      });
    }

    if (url.includes("/cities")) {
      return route.fulfill({
        json: {
          cities: [
            {
              id: "00000000-0000-4000-8000-000000000010",
              name: "Tehran",
              nameFa: "تهران",
              province: "Tehran",
              latitude: 35.6,
              longitude: 51.4,
              timezone: "Asia/Tehran",
            },
          ],
        },
      });
    }

    if (url.includes("/wardrobe/sample-catalog")) {
      return route.fulfill({
        json: {
          items: [{ id: "00000000-0000-4000-8000-000000000020", name: "Shirt" }],
          count: 1,
        },
      });
    }

    if (url.includes("/styling/recommendations") && method === "POST") {
      return route.fulfill({
        json: {
          primary: {
            id: "00000000-0000-4000-8000-000000000030",
            outfit: {
              id: "00000000-0000-4000-8000-000000000031",
              name: "First look",
              description: null,
              style: "casual",
              createdAt: "2026-11-01T10:00:00.000Z",
              items: [
                {
                  clothingItemId: "00000000-0000-4000-8000-000000000032",
                  role: "top",
                  position: 0,
                  item: {
                    id: "00000000-0000-4000-8000-000000000032",
                    wardrobeId: "00000000-0000-4000-8000-000000000033",
                    categoryId: "00000000-0000-4000-8000-000000000034",
                    categorySlug: "shirt",
                    slot: "top",
                    name: "White shirt",
                    primaryColor: "white",
                    colors: ["white"],
                    pattern: "solid",
                    styleTags: ["casual"],
                    seasons: ["all_season"],
                    material: null,
                    formality: "casual",
                    fit: "regular",
                    cut: null,
                    length: null,
                    warmthLevel: 2,
                    size: null,
                    brand: null,
                    sourceType: "sample_catalog",
                    status: "active",
                    imageUrl: null,
                    createdAt: "2026-11-01T10:00:00.000Z",
                    updatedAt: "2026-11-01T10:00:00.000Z",
                    lastWornAt: null,
                  },
                },
              ],
            },
            recommendationType: "first_outfit",
            occasionId: null,
            occasionName: null,
            score: 0.88,
            explanation: "A clean everyday combination.",
            generatedAt: "2026-11-01T10:00:00.000Z",
          },
          alternatives: [],
        },
      });
    }

    if (url.includes("/styling/recommendations") && url.includes("/feedback")) {
      return route.fulfill({ json: { ok: true } });
    }

    if (url.includes("/styling/today")) {
      return route.fulfill({
        json: {
          primary: {
            id: "00000000-0000-4000-8000-000000000030",
            outfit: {
              id: "00000000-0000-4000-8000-000000000031",
              name: "Today look",
              description: null,
              style: "casual",
              createdAt: "2026-11-01T10:00:00.000Z",
              items: [
                {
                  clothingItemId: "00000000-0000-4000-8000-000000000032",
                  role: "top",
                  position: 0,
                  item: {
                    id: "00000000-0000-4000-8000-000000000032",
                    wardrobeId: "00000000-0000-4000-8000-000000000033",
                    categoryId: "00000000-0000-4000-8000-000000000034",
                    categorySlug: "shirt",
                    slot: "top",
                    name: "White shirt",
                    primaryColor: "white",
                    colors: ["white"],
                    pattern: "solid",
                    styleTags: ["casual"],
                    seasons: ["all_season"],
                    material: null,
                    formality: "casual",
                    fit: "regular",
                    cut: null,
                    length: null,
                    warmthLevel: 2,
                    size: null,
                    brand: null,
                    sourceType: "sample_catalog",
                    status: "active",
                    imageUrl: null,
                    createdAt: "2026-11-01T10:00:00.000Z",
                    updatedAt: "2026-11-01T10:00:00.000Z",
                    lastWornAt: null,
                  },
                },
              ],
            },
            recommendationType: "daily",
            occasionId: null,
            occasionName: null,
            score: 0.9,
            explanation: "Works for today.",
            generatedAt: "2026-11-01T10:00:00.000Z",
          },
          alternatives: [],
          weather: {
            id: "00000000-0000-4000-8000-000000000050",
            cityId: "00000000-0000-4000-8000-000000000010",
            cityName: "Tehran",
            temperature: 22,
            feelsLike: 21,
            minTemperature: 16,
            maxTemperature: 26,
            precipitationProbability: 10,
            windSpeed: 8,
            humidity: 45,
            condition: "partly_cloudy",
            forecastAt: "2026-11-01T10:00:00.000Z",
            fetchedAt: "2026-11-01T10:00:00.000Z",
          },
          wardrobeItemCount: 8,
          message: null,
        },
      });
    }

    if (url.includes("/occasions")) {
      return route.fulfill({
        json: {
          occasions: [
            {
              id: "00000000-0000-4000-8000-000000000040",
              name: "Everyday",
              nameFa: "روزمره",
              slug: "everyday",
              category: "daily",
              formalityLevel: 2,
              description: null,
            },
          ],
        },
      });
    }

    if (url.includes("/wardrobe/items")) {
      return route.fulfill({
        json: {
          items: [
            {
              id: "00000000-0000-4000-8000-000000000032",
              wardrobeId: "00000000-0000-4000-8000-000000000033",
              categoryId: "00000000-0000-4000-8000-000000000034",
              categorySlug: "shirt",
              slot: "top",
              name: "White shirt",
              primaryColor: "white",
              colors: ["white"],
              pattern: "solid",
              styleTags: ["casual"],
              seasons: ["all_season"],
              material: null,
              formality: "casual",
              fit: "regular",
              cut: null,
              length: null,
              warmthLevel: 2,
              size: null,
              brand: null,
              sourceType: "sample_catalog",
              status: "active",
              imageUrl: null,
              createdAt: "2026-11-01T10:00:00.000Z",
              updatedAt: "2026-11-01T10:00:00.000Z",
              lastWornAt: null,
            },
          ],
        },
      });
    }

    if (url.includes("/discover/gaps")) {
      return route.fulfill({
        json: {
          gaps: [
            {
              categorySlug: "jacket",
              categoryName: "Versatile jacket",
              categoryNameFa: "کت همه‌کاره",
              reason: "More combinations in cooler weather.",
              reasonFa: "ترکیب بیشتر در هوای خنک.",
              priority: 1,
            },
          ],
          itemCount: 8,
        },
      });
    }

    if (url.includes("/styling/chat")) {
      return route.fulfill({
        json: {
          reply: "Based on your closet, try a white shirt.",
          recommendations: [],
        },
      });
    }

    return route.fulfill({
      status: 200,
      json: {},
    });
  });
}

test.describe("product flows", () => {
  test("onboarding reaches first outfit via sample catalog", async ({ page }) => {
    await mockProductApis(page);
    await page.goto("/onboarding", { waitUntil: "domcontentloaded" });

    await page.getByRole("button", { name: /Get started|شروع کن/ }).click();
    await page.getByRole("button", { name: /^Casual$|^کژوال$/ }).click();
    await page
      .getByRole("button", { name: /Continue|ادامه/ })
      .first()
      .click();
    await page.getByRole("button", { name: /Skip|رد شدن/ }).click();
    await page.getByRole("button", { name: /sample catalog|کاتالوگ نمونه/i }).click();

    await expect(page.getByText(/first outfit|اولین استایل/i)).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/clean everyday combination/i)).toBeVisible();
    await expect(page.getByText(/White shirt|پیراهن/i).first()).toBeVisible();
  });

  test("today shows weather and outfit with mocked APIs", async ({ page }) => {
    await mockProductApis(page);
    await page.goto("/today", { waitUntil: "domcontentloaded" });

    await expect(page.getByText(/Tehran|تهران/i)).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("heading", { name: /Today look|استایل/i })).toBeVisible();
  });

  test("closet lists clothing items", async ({ page }) => {
    await mockProductApis(page);
    await page.goto("/closet", { waitUntil: "domcontentloaded" });

    await expect(page.getByText(/White shirt|پیراهن/i)).toBeVisible({ timeout: 15_000 });
  });

  test("discover shows closet gaps", async ({ page }) => {
    await mockProductApis(page);
    await page.goto("/discover", { waitUntil: "domcontentloaded" });

    await expect(page.getByText(/Versatile jacket|کت همه‌کاره/i)).toBeVisible({
      timeout: 15_000,
    });
  });
});
