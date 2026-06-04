CREATE TABLE "sessions" (
	"id" uuid PRIMARY KEY,
	"userAgent" text,
	"ipAddress" text NOT NULL,
	"userId" uuid
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"username" text NOT NULL,
	"password" text NOT NULL
);
