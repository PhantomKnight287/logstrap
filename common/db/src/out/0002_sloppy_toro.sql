DO $$ BEGIN
 CREATE TYPE "public"."project_mode" AS ENUM('test', 'live');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "projects" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"url" text,
	"public_key" text,
	"test_public_key" text NOT NULL,
	"project_mode" "project_mode" DEFAULT 'test',
	"user_id" text NOT NULL,
	CONSTRAINT "projects_id_unique" UNIQUE("id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "projects" ADD CONSTRAINT "projects_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_email" ON "users" USING btree ("email");