import { describe, expect, it } from "vitest";

import { cn } from "@/shared/lib/cn/cn.js";

describe("cn", () => {
  it("joins truthy class names", () => {
    expect(cn("a", false, "b", null, undefined, "c")).toBe("a b c");
  });
});
