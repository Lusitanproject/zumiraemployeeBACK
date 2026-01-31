/*
  Warnings:

  - You are about to drop the column `resultRatingId` on the `assessment_results` table. All the data in the column will be lost.
  - You are about to drop the `assessments_result_ratings` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `result_ratings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "assessment_results" DROP CONSTRAINT "assessment_results_resultRatingId_fkey";

-- DropForeignKey
ALTER TABLE "assessments_result_ratings" DROP CONSTRAINT "assessments_result_ratings_assessment_id_fkey";

-- DropForeignKey
ALTER TABLE "assessments_result_ratings" DROP CONSTRAINT "assessments_result_ratings_result_rating_id_fkey";

-- AlterTable
ALTER TABLE "assessment_results" DROP COLUMN "resultRatingId",
ADD COLUMN     "assessmentResultRatingId" TEXT;

-- DropTable
DROP TABLE "assessments_result_ratings";

-- DropTable
DROP TABLE "result_ratings";

-- CreateTable
CREATE TABLE "assessment_result_ratings" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "assessment_id" TEXT NOT NULL,
    "notification_type_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "alerts" (
    "id" TEXT NOT NULL,
    "assessment_result_id" TEXT NOT NULL,
    "assessment_result_rating_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "assessment_result_ratings_id_key" ON "assessment_result_ratings"("id");

-- CreateIndex
CREATE UNIQUE INDEX "alerts_id_key" ON "alerts"("id");

-- AddForeignKey
ALTER TABLE "assessment_results" ADD CONSTRAINT "assessment_results_assessmentResultRatingId_fkey" FOREIGN KEY ("assessmentResultRatingId") REFERENCES "assessment_result_ratings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_result_ratings" ADD CONSTRAINT "assessment_result_ratings_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_assessment_result_id_fkey" FOREIGN KEY ("assessment_result_id") REFERENCES "assessment_results"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_assessment_result_rating_id_fkey" FOREIGN KEY ("assessment_result_rating_id") REFERENCES "assessment_result_ratings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
