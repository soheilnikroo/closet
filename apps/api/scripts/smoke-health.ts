import { buildApp } from "@/app.js";
import { loadEnv } from "@/shared/config/index.js";

async function main(): Promise<void> {
  const env = loadEnv();
  const app = await buildApp({ env });
  await app.listen({ host: "127.0.0.1", port: env.API_PORT });

  const response = await fetch(`http://127.0.0.1:${env.API_PORT}/health`);
  const payload: unknown = await response.json();
  console.log(payload);

  await app.close();
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
