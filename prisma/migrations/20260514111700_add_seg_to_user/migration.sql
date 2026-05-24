-- Rename to preserve existing data and avoid dropping/recreating the column.
ALTER TABLE "act_chatbots" RENAME COLUMN "trailId" TO "trail_id";

-- Keep schema naming consistent for the foreign key constraint.
ALTER TABLE "act_chatbots" RENAME CONSTRAINT "act_chatbots_trailId_fkey" TO "act_chatbots_trail_id_fkey";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "similar_exposure_group" TEXT;
