import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  API_HOST: z.string().default("0.0.0.0"),
  API_PORT: z.coerce.number().int().positive().default(8080),
  DATABASE_URL: z.string().min(1),
  WEB_ORIGIN: z.string().url(),
  CLERK_PUBLISHABLE_KEY: z.string().min(1),
  CLERK_SECRET_KEY: z.string().min(1),
  LOCAL_STORAGE_DIR: z.string().default(".data/storage"),
  AI_PROVIDER: z.enum(["mock", "openai"]).optional(),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_BASE_URL: z.string().url().optional(),
  OPENAI_VISION_MODEL: z.string().default("gpt-4o-mini"),
  OPENAI_CHAT_MODEL: z.string().default("gpt-4o-mini"),
  WEATHER_PROVIDER: z.enum(["open-meteo", "mock"]).default("open-meteo"),
  S3_ENDPOINT: z.string().url().optional(),
  S3_BUCKET: z.string().optional(),
  S3_ACCESS_KEY: z.string().optional(),
  S3_SECRET_KEY: z.string().optional(),
  S3_REGION: z.string().default("us-east-1"),
});

export type Env = z.infer<typeof envSchema>;

export function loadEnv(source: Record<string, string | undefined> = process.env): Env {
  const parsed = envSchema.safeParse(source);

  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");
    throw new Error(`Invalid environment configuration: ${details}`);
  }

  return parsed.data;
}

export function hasOpenAiKey(env: Env): boolean {
  return Boolean(env.OPENAI_API_KEY && env.OPENAI_API_KEY.length > 8);
}

export function hasS3Config(env: Env): boolean {
  return Boolean(env.S3_ENDPOINT && env.S3_BUCKET && env.S3_ACCESS_KEY && env.S3_SECRET_KEY);
}
