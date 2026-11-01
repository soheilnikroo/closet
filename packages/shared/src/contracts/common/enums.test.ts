import { describe, expect, it } from "vitest";

import {
  feedbackActionSchema,
  outfitItemRoleSchema,
  styleTagSchema,
} from "@/contracts/common/enums.js";

describe("shared enums", () => {
  it("accepts known values and rejects unknown ones", () => {
    expect(styleTagSchema.safeParse("casual").success).toBe(true);
    expect(styleTagSchema.safeParse("boho").success).toBe(false);
    expect(outfitItemRoleSchema.safeParse("shoes").success).toBe(true);
    expect(feedbackActionSchema.safeParse("save").success).toBe(true);
  });
});
