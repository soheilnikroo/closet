import type { DiscoverGapsResponse, WardrobeGap } from "@closet/shared";

import { SAMPLE_PRODUCTS } from "@/modules/shopping/sample-products.js";
import type { WardrobeService } from "@/modules/wardrobe/wardrobe-service.js";

const GAP_RULES: Array<{
  slot: "top" | "bottom" | "shoes" | "outerwear" | "accessory";
  categorySlug: string;
  categoryName: string;
  categoryNameFa: string;
  reason: string;
  reasonFa: string;
  priority: number;
}> = [
  {
    slot: "outerwear",
    categorySlug: "jacket",
    categoryName: "Versatile jacket",
    categoryNameFa: "کت همه‌کاره",
    reason: "A neutral jacket unlocks more combinations in cooler weather.",
    reasonFa: "یک کت خنثی در هوای خنک‌تر ترکیب‌های بیشتری می‌سازد.",
    priority: 1,
  },
  {
    slot: "shoes",
    categorySlug: "loafers",
    categoryName: "Smart shoes",
    categoryNameFa: "کفش رسمی‌تر",
    reason: "Smarter shoes help cover work and formal occasions.",
    reasonFa: "کفش رسمی‌تر برای کار و موقعیت‌های رسمی مفید است.",
    priority: 2,
  },
  {
    slot: "top",
    categorySlug: "shirt",
    categoryName: "Neutral shirt",
    categoryNameFa: "پیراهن خنثی",
    reason: "A versatile shirt pairs well with most bottoms.",
    reasonFa: "یک پیراهن همه‌کاره با بیشتر پایین‌تنه‌ها جور می‌شود.",
    priority: 3,
  },
  {
    slot: "bottom",
    categorySlug: "trousers",
    categoryName: "Tailored trousers",
    categoryNameFa: "شلوار رسمی‌تر",
    reason: "Tailored trousers raise formality without needing a full suit.",
    reasonFa: "شلوار مرتب‌تر سطح رسمی بودن را بالا می‌برد.",
    priority: 4,
  },
];

export type DiscoverService = {
  getGaps: (userId: string) => Promise<DiscoverGapsResponse>;
};

export function createDiscoverService(wardrobeService: WardrobeService): DiscoverService {
  return {
    async getGaps(userId) {
      const items = await wardrobeService.listItems(userId);
      const slots = new Set(items.map((item) => item.slot));
      const slugs = new Set(items.map((item) => item.categorySlug));

      const gaps: WardrobeGap[] = [];
      for (const rule of GAP_RULES) {
        if (slugs.has(rule.categorySlug)) {
          continue;
        }
        gaps.push({
          categorySlug: rule.categorySlug,
          categoryName: rule.categoryName,
          categoryNameFa: rule.categoryNameFa,
          reason: rule.reason,
          reasonFa: rule.reasonFa,
          priority: rule.priority,
        });
      }

      const missingCore = !slots.has("top") || !slots.has("bottom") || !slots.has("shoes");
      if (items.length < 5 || missingCore) {
        gaps.unshift({
          categorySlug: "basics",
          categoryName: "More everyday basics",
          categoryNameFa: "لباس‌های روزمره بیشتر",
          reason: "A few more tops and bottoms will unlock better daily outfits.",
          reasonFa: "چند بالا و پایین بیشتر، پیشنهادهای روزانه را بهتر می‌کند.",
          priority: 1,
        });
      }

      return {
        gaps: gaps.slice(0, 5),
        products: [
          ...SAMPLE_PRODUCTS.filter((product) =>
            gaps.some((gap) => gap.categorySlug === product.categorySlug),
          ),
          ...SAMPLE_PRODUCTS.filter(
            (product) => !gaps.some((gap) => gap.categorySlug === product.categorySlug),
          ),
        ],
        itemCount: items.length,
      };
    },
  };
}
