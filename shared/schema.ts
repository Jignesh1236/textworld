import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const textEntries = pgTable("text_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  content: text("content").notNull(),
  x: integer("x").notNull(),
  y: integer("y").notNull(),
  createdAt: timestamp("created_at").default(sql`now()`).notNull(),
});

export const insertTextEntrySchema = createInsertSchema(textEntries).omit({
  id: true,
  createdAt: true,
});

export type InsertTextEntry = z.infer<typeof insertTextEntrySchema>;
export type TextEntry = typeof textEntries.$inferSelect;
