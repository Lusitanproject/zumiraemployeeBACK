/*
  Warnings:

  - Made the column `trailId` on table `act_chatbots` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "act_chatbots" DROP CONSTRAINT "act_chatbots_trailId_fkey";

-- Create a default trail and update existing act_chatbots
DO $$
DECLARE
    default_trail_id TEXT;
BEGIN
    -- Insert a default trail and get its id
    INSERT INTO "trails" ("id", "title", "subtitle", "description", "created_at", "updated_at")
    VALUES ('cmfif87mw000008jw8aw65gzt', 'Trilha Padrão', 'Trilha padrão para chatbots existentes', 'Esta é uma trilha padrão criada para garantir que todos os chatbots tenham uma trilha associada.', NOW(), NOW())
    ON CONFLICT ("id") DO NOTHING
    RETURNING "id" INTO default_trail_id;

    -- Update all act_chatbots that have a null trailId
    UPDATE "act_chatbots"
    SET "trailId" = default_trail_id
    WHERE "trailId" IS NULL;
END $$;

-- AlterTable
ALTER TABLE "act_chatbots" ALTER COLUMN "trailId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "act_chatbots" ADD CONSTRAINT "act_chatbots_trailId_fkey" FOREIGN KEY ("trailId") REFERENCES "trails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
