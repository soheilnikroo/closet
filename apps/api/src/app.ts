import path from "node:path";

import { clerkPlugin } from "@clerk/fastify";
import { apiErrorSchema } from "@closet/shared";
import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import multipart from "@fastify/multipart";
import rateLimit from "@fastify/rate-limit";
import Fastify from "fastify";

import {
  createAiProviders,
  createDatabase,
  createInProcessJobQueue,
  createLocalObjectStorage,
  createWeatherClient,
  runSeeds,
  type Database,
} from "@/infrastructure/index.js";
import {
  createDiscoverService,
  createProfileService,
  createStylingService,
  createUsersService,
  createWardrobeService,
  createWeatherService,
  registerDiscoverRoutes,
  registerHealthRoutes,
  registerProfileRoutes,
  registerStylingRoutes,
  registerUsersRoutes,
  registerWardrobeRoutes,
  registerWeatherRoutes,
} from "@/modules/index.js";
import type { Env } from "@/shared/config/index.js";
import { HttpError, serviceUnavailable } from "@/shared/errors/index.js";

export type AppDeps = {
  env: Env;
  db?: Database;
};

function hasRealClerkKeys(env: Env): boolean {
  return (
    !env.CLERK_PUBLISHABLE_KEY.includes("replace_me") &&
    !env.CLERK_SECRET_KEY.includes("replace_me") &&
    env.CLERK_PUBLISHABLE_KEY.startsWith("pk_") &&
    env.CLERK_SECRET_KEY.startsWith("sk_")
  );
}

export async function buildApp(deps: AppDeps) {
  const app = Fastify({
    logger: deps.env.NODE_ENV !== "test",
    trustProxy: deps.env.NODE_ENV === "production",
  });

  const clerkReady = hasRealClerkKeys(deps.env);

  if (deps.env.NODE_ENV === "production" && !clerkReady) {
    throw new Error("Refusing to start: production requires real Clerk keys");
  }

  const db = deps.db ?? createDatabase(deps.env.DATABASE_URL);
  await runSeeds(db);

  const storage = createLocalObjectStorage(
    path.isAbsolute(deps.env.LOCAL_STORAGE_DIR)
      ? deps.env.LOCAL_STORAGE_DIR
      : path.resolve(process.cwd(), deps.env.LOCAL_STORAGE_DIR),
  );
  const queue = createInProcessJobQueue();
  const ai = createAiProviders(deps.env);
  const weatherClient = createWeatherClient(deps.env);

  const usersService = createUsersService(db);
  const profileService = createProfileService(db);
  const wardrobeService = createWardrobeService({ db, storage, queue, ai });
  wardrobeService.registerVisionWorker();
  const weatherService = createWeatherService({ db, weatherClient });
  const stylingService = createStylingService({
    db,
    wardrobeService,
    profileService,
    weatherService,
    ai,
  });
  const discoverService = createDiscoverService(wardrobeService);

  await app.register(helmet, {
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  });

  await app.register(cors, {
    origin: deps.env.WEB_ORIGIN,
    credentials: true,
    methods: ["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Authorization", "Content-Type", "Accept"],
    maxAge: 600,
  });

  await app.register(rateLimit, {
    max: deps.env.NODE_ENV === "test" ? 10_000 : 120,
    timeWindow: "1 minute",
    allowList: deps.env.NODE_ENV === "test" ? ["127.0.0.1", "::1"] : [],
  });

  await app.register(multipart, {
    limits: {
      fileSize: 12 * 1024 * 1024,
      files: 1,
    },
  });

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof HttpError) {
      const payload = apiErrorSchema.parse({
        error: {
          code: error.code,
          message: error.message,
          details: error.details,
        },
      });
      return reply.status(error.statusCode).send(payload);
    }

    app.log.error(error);

    const payload = apiErrorSchema.parse({
      error: {
        code: "internal_error",
        message: "Unexpected server error",
      },
    });

    return reply.status(500).send(payload);
  });

  await registerHealthRoutes(app);

  await app.register(async (protectedScope) => {
    if (!clerkReady) {
      protectedScope.addHook("onRequest", async () => {
        throw serviceUnavailable("Authentication is not configured");
      });
    } else {
      await protectedScope.register(clerkPlugin, {
        publishableKey: deps.env.CLERK_PUBLISHABLE_KEY,
        secretKey: deps.env.CLERK_SECRET_KEY,
      });
    }

    await registerUsersRoutes(protectedScope, {
      usersService,
      env: deps.env,
    });
    await registerProfileRoutes(protectedScope, {
      db,
      env: deps.env,
      usersService,
      profileService,
    });
    await registerWardrobeRoutes(protectedScope, {
      env: deps.env,
      usersService,
      wardrobeService,
    });
    await registerStylingRoutes(protectedScope, {
      env: deps.env,
      usersService,
      stylingService,
    });
    await registerWeatherRoutes(protectedScope, {
      env: deps.env,
      usersService,
      profileService,
      weatherService,
    });
    await registerDiscoverRoutes(protectedScope, {
      env: deps.env,
      usersService,
      discoverService,
    });
  });

  return app;
}
