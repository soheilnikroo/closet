import { createMockAiProviders } from "@/infrastructure/ai/mock-providers.js";
import { createOpenAiProviders } from "@/infrastructure/ai/openai-providers.js";
import type { AiProviders } from "@/infrastructure/ai/types.js";
import { hasOpenAiKey, type Env } from "@/shared/config/index.js";

export type {
  AiProviders,
  VisionProvider,
  LlmProvider,
  StylistIntent,
} from "@/infrastructure/ai/types.js";
export { createMockAiProviders } from "@/infrastructure/ai/mock-providers.js";
export { createOpenAiProviders } from "@/infrastructure/ai/openai-providers.js";

export function createAiProviders(env: Env): AiProviders {
  if (env.AI_PROVIDER === "mock" || !hasOpenAiKey(env)) {
    return createMockAiProviders();
  }
  return createOpenAiProviders(env);
}
