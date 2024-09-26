import { pgTable, uuid, varchar, timestamp, jsonb } from "drizzle-orm/pg-core";
import { projects } from "./projects";

export const tradingAccounts = pgTable("trading_accounts", {
  id: uuid("id").defaultRandom().primaryKey(),
  projectId: uuid("project_id").references(() => projects.id).notNull(),
  accountId: varchar("account_id", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  login: varchar("login", { length: 255 }).notNull(),
  server: varchar("server", { length: 255 }).notNull(),
  accountInfo: jsonb("account_info"),
  metrics: jsonb("metrics"),
  openTrades: jsonb("open_trades"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
});

export type TradingAccount = typeof tradingAccounts.$inferSelect;
export type InsertTradingAccount = typeof tradingAccounts.$inferInsert;