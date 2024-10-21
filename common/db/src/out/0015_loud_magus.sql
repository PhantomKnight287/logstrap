ALTER TABLE "application_logs" ALTER COLUMN "iv" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "application_logs" ALTER COLUMN "iv" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "request_logs" ALTER COLUMN "iv" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "request_logs" ALTER COLUMN "iv" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "system_logs" ALTER COLUMN "iv" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "system_logs" ALTER COLUMN "iv" SET NOT NULL;