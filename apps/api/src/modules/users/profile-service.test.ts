import { afterAll, beforeAll, describe, expect, it } from "vitest";

import type { Database } from "../../infrastructure/database/index.js";
import {
  createTestDatabase,
  createTestUser,
  deleteTestUser,
} from "../../shared/testing/test-db.js";
import { createProfileService } from "./profile-service.js";

describe("createProfileService", () => {
  let db: Database;
  let userId = "";

  beforeAll(async () => {
    db = await createTestDatabase();
    const user = await createTestUser(db);
    userId = user.id;
  });

  afterAll(async () => {
    if (userId) {
      await deleteTestUser(db, userId);
    }
  });

  it("creates defaults and updates profile + style", async () => {
    const service = createProfileService(db);
    const profile = await service.getProfile(userId);
    expect(profile.onboardingStep).toBe("welcome");

    const cities = await service.listCities();
    expect(cities.length).toBeGreaterThan(0);
    const tehran = cities.find((city) => city.name === "Tehran");
    expect(tehran).toBeTruthy();

    const updated = await service.updateProfile(userId, {
      cityId: tehran?.id ?? null,
      onboardingStep: "styles",
      preferredLanguage: "fa-IR",
    });
    expect(updated.onboardingStep).toBe("styles");
    expect(updated.preferredLanguage).toBe("fa-IR");

    const style = await service.updateStyleProfile(userId, {
      preferredStyles: ["minimal", "casual"],
      preferredFits: ["regular"],
    });
    expect(style.preferredStyles).toContain("minimal");

    const loadedStyle = await service.getStyleProfile(userId);
    expect(loadedStyle.preferredFits).toContain("regular");
  });
});
