import { z } from "zod";

const webEnvSchema = z.object({
  VITE_CLERK_PUBLISHABLE_KEY: z.string().min(1),
  VITE_API_BASE_URL: z.string().url(),
});

export type WebEnv = z.infer<typeof webEnvSchema>;

export function getWebEnv(source: Record<string, string | undefined> = import.meta.env): WebEnv {
  const parsed = webEnvSchema.safeParse({
    VITE_CLERK_PUBLISHABLE_KEY: source["VITE_CLERK_PUBLISHABLE_KEY"],
    VITE_API_BASE_URL: source["VITE_API_BASE_URL"],
  });

  if (!parsed.success) {
    const details = parsed.error.issues
      .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
      .join("; ");
    throw new Error(`Invalid web environment: ${details}`);
  }

  return parsed.data;
}

export function getOptionalClerkPublishableKey(): string | null {
  const value = import.meta.env["VITE_CLERK_PUBLISHABLE_KEY"];
  return typeof value === "string" && value.length > 0 ? value : null;
}

export function getApiBaseUrl(): string {
  const value = import.meta.env["VITE_API_BASE_URL"];
  return typeof value === "string" && value.length > 0 ? value : "http://localhost:8080";
}
