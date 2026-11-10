ALTER TABLE "clothing_items" ADD COLUMN "labels" jsonb DEFAULT '[]'::jsonb NOT NULL;
