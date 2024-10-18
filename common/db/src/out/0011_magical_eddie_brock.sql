ALTER TABLE "application_logs" DROP CONSTRAINT "application_logs_api_key_id_api_keys_id_fk";
--> statement-breakpoint
ALTER TABLE "request_logs" DROP CONSTRAINT "request_logs_api_key_id_api_keys_id_fk";
--> statement-breakpoint
ALTER TABLE "system_logs" DROP CONSTRAINT "system_logs_api_key_id_api_keys_id_fk";
--> statement-breakpoint
ALTER TABLE "application_logs" ALTER COLUMN "request_id" SET DEFAULT null;--> statement-breakpoint
ALTER TABLE "application_logs" ALTER COLUMN "request_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "system_logs" ALTER COLUMN "request_id" SET DEFAULT null;--> statement-breakpoint
ALTER TABLE "system_logs" ALTER COLUMN "request_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "system_logs" ALTER COLUMN "api_key_id" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "application_logs" ADD CONSTRAINT "application_logs_api_key_id_api_keys_id_fk" FOREIGN KEY ("api_key_id") REFERENCES "public"."api_keys"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "request_logs" ADD CONSTRAINT "request_logs_api_key_id_api_keys_id_fk" FOREIGN KEY ("api_key_id") REFERENCES "public"."api_keys"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "system_logs" ADD CONSTRAINT "system_logs_api_key_id_api_keys_id_fk" FOREIGN KEY ("api_key_id") REFERENCES "public"."api_keys"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
