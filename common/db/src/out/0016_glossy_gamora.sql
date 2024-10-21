ALTER TABLE "application_logs" ALTER COLUMN "additional_info" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "request_logs" ALTER COLUMN "request_body" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "request_logs" ALTER COLUMN "response_body" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "request_logs" ALTER COLUMN "request_headers" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "request_logs" ALTER COLUMN "response_headers" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "request_logs" ALTER COLUMN "cookies" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "system_logs" ALTER COLUMN "details" SET DATA TYPE text;