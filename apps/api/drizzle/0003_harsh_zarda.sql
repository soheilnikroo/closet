CREATE TABLE "collection_outfits" (
	"collection_id" uuid NOT NULL,
	"outfit_id" uuid NOT NULL,
	"snapshot" jsonb NOT NULL,
	"saved_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "collection_outfits_collection_id_outfit_id_pk" PRIMARY KEY("collection_id","outfit_id")
);
--> statement-breakpoint
CREATE TABLE "outfit_collections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(80) NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"occasion" varchar(80) DEFAULT '' NOT NULL,
	"season" varchar(16) DEFAULT 'any' NOT NULL,
	"color" varchar(16) DEFAULT 'forest' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "collection_outfits" ADD CONSTRAINT "collection_outfits_collection_id_outfit_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."outfit_collections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "collection_outfits" ADD CONSTRAINT "collection_outfits_outfit_id_outfits_id_fk" FOREIGN KEY ("outfit_id") REFERENCES "public"."outfits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outfit_collections" ADD CONSTRAINT "outfit_collections_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "collections_user_idx" ON "outfit_collections" USING btree ("user_id");