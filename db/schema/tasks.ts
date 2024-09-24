import { pgTable, uuid, varchar, boolean, timestamp, text } from "drizzle-orm/pg-core";
import { projects } from "./projects";

export const tasks = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  content: text("content").notNull(),
  completed: boolean("completed").default(false).notNull(),
  completedDate: timestamp("completed_date"),
  projectId: uuid("project_id").references(() => projects.id).notNull(),
  userId: varchar("user_id", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export type Task = typeof tasks.$inferSelect;
export type InsertTask = typeof tasks.$inferInsert;