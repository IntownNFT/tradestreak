DROP TABLE "account_statistics";--> statement-breakpoint
ALTER TABLE "trading_accounts" ADD COLUMN "meta_stats" jsonb;