ALTER TABLE "account_statistics" ALTER COLUMN "balance" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "account_statistics" ALTER COLUMN "equity" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "account_statistics" ALTER COLUMN "profit" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "account_statistics" ALTER COLUMN "trading_volume" SET DATA TYPE numeric(10, 2);--> statement-breakpoint
ALTER TABLE "account_statistics" ADD COLUMN "free_margin" numeric(10, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "account_statistics" ADD COLUMN "margin" numeric(10, 2) NOT NULL;--> statement-breakpoint
ALTER TABLE "account_statistics" ADD COLUMN "margin_level" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "account_statistics" ADD COLUMN "last_update_time" timestamp NOT NULL;