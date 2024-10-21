ALTER TABLE "application_logs" ADD COLUMN "iv" varchar(32) DEFAULT null;--> statement-breakpoint
ALTER TABLE "request_logs" ADD COLUMN "iv" varchar(32) DEFAULT null;--> statement-breakpoint
ALTER TABLE "system_logs" ADD COLUMN "iv" varchar(32) DEFAULT null;