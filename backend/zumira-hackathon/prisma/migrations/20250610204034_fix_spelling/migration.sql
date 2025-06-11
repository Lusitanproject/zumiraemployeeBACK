/*
  Warnings:

  - You are about to rename the column `acronymn` to `acronym` on the `nationalities` table.
  - A unique constraint covering the columns `[acronym]` on the table `nationalities` will be added. If there are existing duplicate values, this will fail.
*/

-- DropIndex
DROP INDEX "nationalities_acronymn_key";

-- AlterTable
ALTER TABLE "nationalities" RENAME COLUMN "acronymn" TO "acronym";

-- CreateIndex
CREATE UNIQUE INDEX "nationalities_acronym_key" ON "nationalities"("acronym");
