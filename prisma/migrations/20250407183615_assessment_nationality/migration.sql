/*
  Warnings:

  - Added the required column `nationalityId` to the `assessments` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "assessments" ADD COLUMN     "nationalityId" TEXT;

-- CreateTable
CREATE TABLE "nationalities" (
    "id" TEXT NOT NULL,
    "acronymn" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "nationalities_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "nationalities_acronymn_key" ON "nationalities"("acronymn");

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_nationalityId_fkey" FOREIGN KEY ("nationalityId") REFERENCES "nationalities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

INSERT INTO "nationalities" ("id", "acronymn", "name")
VALUES ('cm97f77vw00010cjpc59be3ko', 'pt-br', 'Português Brasileiro');

UPDATE "assessments"
SET "nationalityId" = 'cm97f77vw00010cjpc59be3ko'
WHERE "nationalityId" IS NULL;

ALTER TABLE "assessments"
ALTER COLUMN "nationalityId" SET NOT NULL;
