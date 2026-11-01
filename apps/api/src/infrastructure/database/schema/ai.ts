import { integer, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { usersTable } from "./users.js";
import { mediaAssetsTable } from "./wardrobe.js";

export const aiJobTypeEnum = pgEnum("ai_job_type", [
  "clothing_vision",
  "product_extract",
  "stylist_chat",
]);

export const aiJobStatusEnum = pgEnum("ai_job_status", [
  "queued",
  "running",
  "succeeded",
  "failed",
]);

export const aiProcessingJobsTable = pgTable("ai_processing_jobs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => usersTable.id, { onDelete: "cascade" }),
  jobType: aiJobTypeEnum("job_type").notNull(),
  inputAssetId: uuid("input_asset_id").references(() => mediaAssetsTable.id, {
    onDelete: "set null",
  }),
  provider: varchar("provider", { length: 64 }).notNull(),
  model: varchar("model", { length: 120 }).notNull(),
  status: aiJobStatusEnum("status").notNull().default("queued"),
  inputTokens: integer("input_tokens"),
  outputTokens: integer("output_tokens"),
  estimatedCost: integer("estimated_cost"),
  error: text("error"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp("completed_at", { withTimezone: true }),
});

export type AiProcessingJobRow = typeof aiProcessingJobsTable.$inferSelect;
