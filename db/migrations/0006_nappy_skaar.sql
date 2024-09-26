ALTER TABLE "trading_accounts" ADD COLUMN "account_info" jsonb;--> statement-breakpoint
ALTER TABLE "trading_accounts" ADD COLUMN "metrics" jsonb;--> statement-breakpoint
ALTER TABLE "trading_accounts" ADD COLUMN "open_trades" jsonb;