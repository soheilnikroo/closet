import { hasOpenAiKey, type Env } from "../../shared/config/index.js";
import { createMockAiProviders } from "./mock-providers.js";
import { createOpenAiProviders } from "./openai-providers.js";
import type { AiProviders } from "./types.js";

export type { AiProviders, VisionProvider, LlmProvider, StylistIntent } from "./types.js";
export { createMockAiProviders } from "./mock-providers.js";
export { createOpenAiProviders } from "./openai-providers.js";

export function createAiProviders(env: Env): AiProviders {
  if (hasOpenAiKey(env)) {
    return createOpenAiProviders(env);
  }
  return createMockAiProviders();
}
