/*
  Warnings:

  - Made the column `trailId` on table `companies` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "companies" DROP CONSTRAINT "companies_trailId_fkey";

-- Link existing companies to the first trail
DO $$
DECLARE
    first_trail_id TEXT;
BEGIN
    -- Find the id of the first trail created
    SELECT "id" INTO first_trail_id FROM "trails" ORDER BY "created_at" ASC LIMIT 1;

    -- Update all companies that have a null trailId, if a trail exists
    IF first_trail_id IS NOT NULL THEN
        UPDATE "companies"
        SET "trailId" = first_trail_id
        WHERE "trailId" IS NULL;
    END IF;
END $$;

-- AlterTable
ALTER TABLE "companies" ALTER COLUMN "trailId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_trailId_fkey" FOREIGN KEY ("trailId") REFERENCES "trails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
