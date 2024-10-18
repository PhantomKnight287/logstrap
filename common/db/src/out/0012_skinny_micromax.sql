ALTER TABLE "application_logs" DROP CONSTRAINT "application_logs_request_id_request_logs_id_fk";
--> statement-breakpoint
ALTER TABLE "system_logs" DROP CONSTRAINT "system_logs_request_id_request_logs_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "application_logs" ADD CONSTRAINT "application_logs_request_id_request_logs_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."request_logs"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "system_logs" ADD CONSTRAINT "system_logs_request_id_request_logs_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."request_logs"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
