import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const contactRateLimits = sqliteTable("contact_rate_limits", {
  visitorKey: text("visitor_key").primaryKey(),
  windowStartedAt: integer("window_started_at").notNull(),
  submissionCount: integer("submission_count").notNull(),
});
