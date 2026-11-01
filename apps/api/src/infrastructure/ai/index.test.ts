import { describe, expect, it } from "vitest";

import { createAiProviders } from "@/infrastructure/ai/index.js";
import type { Env } from "@/shared/config/index.js";

describe("createAiProviders", () => {
  it("falls back to mock providers without an API key", () => {
    const providers = createAiProviders({
      OPENAI_API_KEY: undefined,
    } as Env);
    expect(providers.vision.name).toBe("mock");
    expect(providers.llm.name).toBe("mock");
  });

  it("selects openai providers when a key exists", () => {
    const providers = createAiProviders({
      OPENAI_API_KEY: "sk-test-12345678",
      OPENAI_VISION_MODEL: "gpt-4o-mini",
      OPENAI_CHAT_MODEL: "gpt-4o-mini",
    } as Env);
    expect(providers.vision.name).toBe("openai");
    expect(providers.llm.name).toBe("openai");
  });
});
