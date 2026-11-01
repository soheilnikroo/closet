import { eq } from "drizzle-orm";

import type { Database } from "../client.js";
import { citiesTable, clothingCategoriesTable, occasionsTable } from "../schema/index.js";
import { CLOTHING_CATEGORIES, IRAN_CITIES, OCCASIONS } from "./index.js";

export async function runSeeds(db: Database): Promise<void> {
  for (const city of IRAN_CITIES) {
    const existing = await db
      .select({ id: citiesTable.id })
      .from(citiesTable)
      .where(eq(citiesTable.name, city.name))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(citiesTable).values(city);
    }
  }

  for (const category of CLOTHING_CATEGORIES) {
    const existing = await db
      .select({ id: clothingCategoriesTable.id })
      .from(clothingCategoriesTable)
      .where(eq(clothingCategoriesTable.slug, category.slug))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(clothingCategoriesTable).values(category);
    }
  }

  for (const occasion of OCCASIONS) {
    const existing = await db
      .select({ id: occasionsTable.id })
      .from(occasionsTable)
      .where(eq(occasionsTable.slug, occasion.slug))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(occasionsTable).values(occasion);
    }
  }
}
