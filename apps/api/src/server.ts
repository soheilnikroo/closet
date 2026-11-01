import { buildApp } from "@/app.js";
import { loadEnv } from "@/shared/config/index.js";

async function main(): Promise<void> {
  const env = loadEnv();
  const app = await buildApp({ env });

  await app.listen({
    host: env.API_HOST,
    port: env.API_PORT,
  });
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
