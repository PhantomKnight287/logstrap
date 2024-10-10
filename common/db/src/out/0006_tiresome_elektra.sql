CREATE TABLE IF NOT EXISTS "api_keys" (
	"id" text,
	"key" text NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"user_id" text NOT NULL,
	"project_mode" "project_mode" DEFAULT 'test',
	"project_id" text NOT NULL,
	CONSTRAINT "api_keys_id_unique" UNIQUE("id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN IF EXISTS "public_key";--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN IF EXISTS "test_public_key";