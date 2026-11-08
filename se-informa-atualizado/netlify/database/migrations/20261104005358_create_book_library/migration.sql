CREATE TABLE "book_editions" (
	"id" text PRIMARY KEY,
	"source_id" text NOT NULL,
	"title" text NOT NULL,
	"original_title" text NOT NULL,
	"author" text NOT NULL,
	"language" text NOT NULL,
	"translator" text,
	"edition" text NOT NULL,
	"institution" text NOT NULL,
	"origin_url" text NOT NULL,
	"text_url" text,
	"rights" text NOT NULL,
	"rights_note" text NOT NULL,
	"rights_url" text NOT NULL,
	"status" text NOT NULL,
	"checksum" text,
	"chunk_count" integer DEFAULT 0 NOT NULL,
	"checked_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "book_passages" (
	"id" text PRIMARY KEY,
	"edition_id" text NOT NULL,
	"ordinal" integer NOT NULL,
	"section" text NOT NULL,
	"paragraph_start" integer NOT NULL,
	"paragraph_end" integer NOT NULL,
	"page" text,
	"content" text NOT NULL
);
--> statement-breakpoint
CREATE INDEX "book_passages_edition_idx" ON "book_passages" ("edition_id");--> statement-breakpoint
ALTER TABLE "book_passages" ADD CONSTRAINT "book_passages_edition_id_book_editions_id_fkey" FOREIGN KEY ("edition_id") REFERENCES "book_editions"("id") ON DELETE CASCADE;