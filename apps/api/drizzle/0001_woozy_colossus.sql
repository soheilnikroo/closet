CREATE TYPE "public"."ai_job_status" AS ENUM('queued', 'running', 'succeeded', 'failed');--> statement-breakpoint
CREATE TYPE "public"."ai_job_type" AS ENUM('clothing_vision', 'product_extract', 'stylist_chat');--> statement-breakpoint
CREATE TYPE "public"."analysis_status" AS ENUM('pending', 'succeeded', 'failed');--> statement-breakpoint
CREATE TYPE "public"."clothing_slot" AS ENUM('top', 'bottom', 'shoes', 'outerwear', 'accessory');--> statement-breakpoint
CREATE TYPE "public"."clothing_source_type" AS ENUM('photo', 'manual', 'sample_catalog', 'import');--> statement-breakpoint
CREATE TYPE "public"."clothing_status" AS ENUM('active', 'archived', 'deleted');--> statement-breakpoint
CREATE TYPE "public"."feedback_action" AS ENUM('like', 'dislike', 'save', 'worn', 'regenerate');--> statement-breakpoint
CREATE TYPE "public"."media_processing_status" AS ENUM('pending', 'processing', 'ready', 'failed');--> statement-breakpoint
CREATE TYPE "public"."onboarding_step" AS ENUM('welcome', 'styles', 'city', 'clothing', 'review', 'first_outfit', 'feedback', 'done');--> statement-breakpoint
CREATE TYPE "public"."outfit_item_role" AS ENUM('top', 'bottom', 'shoes', 'outerwear', 'accessory');--> statement-breakpoint
CREATE TYPE "public"."preference_source" AS ENUM('user', 'ai', 'interaction');--> statement-breakpoint
CREATE TYPE "public"."recommendation_type" AS ENUM('daily', 'occasion', 'chat', 'alternative', 'first_outfit');--> statement-breakpoint
CREATE TYPE "public"."temperature_preference" AS ENUM('celsius', 'fahrenheit');--> statement-breakpoint
CREATE TABLE "ai_processing_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"job_type" "ai_job_type" NOT NULL,
	"input_asset_id" uuid,
	"provider" varchar(64) NOT NULL,
	"model" varchar(120) NOT NULL,
	"status" "ai_job_status" DEFAULT 'queued' NOT NULL,
	"input_tokens" integer,
	"output_tokens" integer,
	"estimated_cost" integer,
	"error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "cities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(120) NOT NULL,
	"name_fa" varchar(120) NOT NULL,
	"province" varchar(120) NOT NULL,
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL,
	"timezone" varchar(64) DEFAULT 'Asia/Tehran' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clothing_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"parent_id" uuid,
	"name" varchar(120) NOT NULL,
	"name_fa" varchar(120) NOT NULL,
	"slug" varchar(120) NOT NULL,
	"slot" "clothing_slot" NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "clothing_categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "clothing_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clothing_item_id" uuid NOT NULL,
	"media_asset_id" uuid NOT NULL,
	"image_type" varchar(32) DEFAULT 'primary' NOT NULL,
	"is_primary" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clothing_item_analyses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"clothing_item_id" uuid NOT NULL,
	"provider" varchar(64) NOT NULL,
	"model" varchar(120) NOT NULL,
	"analysis_version" varchar(32) DEFAULT '1' NOT NULL,
	"result" jsonb NOT NULL,
	"confidence" real,
	"status" "analysis_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clothing_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"wardrobe_id" uuid NOT NULL,
	"category_id" uuid NOT NULL,
	"name" varchar(160) NOT NULL,
	"primary_color" varchar(64) NOT NULL,
	"colors" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"pattern" varchar(64),
	"style_tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"seasons" jsonb DEFAULT '["all_season"]'::jsonb NOT NULL,
	"material" varchar(120),
	"formality" varchar(64),
	"fit" varchar(64),
	"cut" varchar(64),
	"length" varchar(64),
	"warmth_level" integer,
	"size" varchar(32),
	"brand" varchar(120),
	"condition" varchar(64),
	"source_type" "clothing_source_type" DEFAULT 'manual' NOT NULL,
	"status" "clothing_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_worn_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "media_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"storage_key" text NOT NULL,
	"mime_type" varchar(120) NOT NULL,
	"size_bytes" integer NOT NULL,
	"processing_status" "media_processing_status" DEFAULT 'pending' NOT NULL,
	"detections" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"error" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "occasions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(120) NOT NULL,
	"name_fa" varchar(120) NOT NULL,
	"slug" varchar(120) NOT NULL,
	"category" varchar(64) NOT NULL,
	"formality_level" integer DEFAULT 2 NOT NULL,
	"description" text,
	CONSTRAINT "occasions_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "outfit_feedback" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"recommendation_id" uuid NOT NULL,
	"action" "feedback_action" NOT NULL,
	"reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "outfit_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"outfit_id" uuid NOT NULL,
	"clothing_item_id" uuid NOT NULL,
	"role" "outfit_item_role" NOT NULL,
	"position" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "outfit_recommendations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"outfit_id" uuid NOT NULL,
	"recommendation_type" "recommendation_type" NOT NULL,
	"occasion_id" uuid,
	"weather_snapshot_id" uuid,
	"score" double precision NOT NULL,
	"explanation" text NOT NULL,
	"algorithm_version" varchar(32) DEFAULT '1.0' NOT NULL,
	"generated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expires_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "outfits" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(160),
	"description" text,
	"style" varchar(64),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_preferences" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"preference_type" varchar(64) NOT NULL,
	"preference_value" jsonb NOT NULL,
	"source" "preference_source" DEFAULT 'user' NOT NULL,
	"confidence" real DEFAULT 1 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"city_id" uuid,
	"currency" varchar(8) DEFAULT 'IRR' NOT NULL,
	"temperature_preference" "temperature_preference" DEFAULT 'celsius' NOT NULL,
	"preferred_language" varchar(16) DEFAULT 'en-GB' NOT NULL,
	"onboarding_completed" boolean DEFAULT false NOT NULL,
	"onboarding_step" "onboarding_step" DEFAULT 'welcome' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_style_profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"preferred_styles" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"preferred_fits" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"disliked_fits" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"preferred_colors" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"disliked_colors" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"comfort_priority" boolean,
	"lifestyle_preferences" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "wardrobes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(120) DEFAULT 'My Closet' NOT NULL,
	"is_default" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "weather_snapshots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"city_id" uuid NOT NULL,
	"temperature" double precision NOT NULL,
	"feels_like" double precision NOT NULL,
	"min_temperature" double precision NOT NULL,
	"max_temperature" double precision NOT NULL,
	"precipitation_probability" integer DEFAULT 0 NOT NULL,
	"wind_speed" double precision DEFAULT 0 NOT NULL,
	"humidity" integer DEFAULT 50 NOT NULL,
	"condition" varchar(64) NOT NULL,
	"forecast_at" timestamp with time zone NOT NULL,
	"fetched_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ai_processing_jobs" ADD CONSTRAINT "ai_processing_jobs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_processing_jobs" ADD CONSTRAINT "ai_processing_jobs_input_asset_id_media_assets_id_fk" FOREIGN KEY ("input_asset_id") REFERENCES "public"."media_assets"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clothing_images" ADD CONSTRAINT "clothing_images_clothing_item_id_clothing_items_id_fk" FOREIGN KEY ("clothing_item_id") REFERENCES "public"."clothing_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clothing_images" ADD CONSTRAINT "clothing_images_media_asset_id_media_assets_id_fk" FOREIGN KEY ("media_asset_id") REFERENCES "public"."media_assets"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clothing_item_analyses" ADD CONSTRAINT "clothing_item_analyses_clothing_item_id_clothing_items_id_fk" FOREIGN KEY ("clothing_item_id") REFERENCES "public"."clothing_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clothing_items" ADD CONSTRAINT "clothing_items_wardrobe_id_wardrobes_id_fk" FOREIGN KEY ("wardrobe_id") REFERENCES "public"."wardrobes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clothing_items" ADD CONSTRAINT "clothing_items_category_id_clothing_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."clothing_categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "media_assets" ADD CONSTRAINT "media_assets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outfit_feedback" ADD CONSTRAINT "outfit_feedback_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outfit_feedback" ADD CONSTRAINT "outfit_feedback_recommendation_id_outfit_recommendations_id_fk" FOREIGN KEY ("recommendation_id") REFERENCES "public"."outfit_recommendations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outfit_items" ADD CONSTRAINT "outfit_items_outfit_id_outfits_id_fk" FOREIGN KEY ("outfit_id") REFERENCES "public"."outfits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outfit_items" ADD CONSTRAINT "outfit_items_clothing_item_id_clothing_items_id_fk" FOREIGN KEY ("clothing_item_id") REFERENCES "public"."clothing_items"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outfit_recommendations" ADD CONSTRAINT "outfit_recommendations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outfit_recommendations" ADD CONSTRAINT "outfit_recommendations_outfit_id_outfits_id_fk" FOREIGN KEY ("outfit_id") REFERENCES "public"."outfits"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outfit_recommendations" ADD CONSTRAINT "outfit_recommendations_occasion_id_occasions_id_fk" FOREIGN KEY ("occasion_id") REFERENCES "public"."occasions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outfit_recommendations" ADD CONSTRAINT "outfit_recommendations_weather_snapshot_id_weather_snapshots_id_fk" FOREIGN KEY ("weather_snapshot_id") REFERENCES "public"."weather_snapshots"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "outfits" ADD CONSTRAINT "outfits_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profiles" ADD CONSTRAINT "user_profiles_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_style_profiles" ADD CONSTRAINT "user_style_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "wardrobes" ADD CONSTRAINT "wardrobes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "weather_snapshots" ADD CONSTRAINT "weather_snapshots_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE cascade ON UPDATE no action;