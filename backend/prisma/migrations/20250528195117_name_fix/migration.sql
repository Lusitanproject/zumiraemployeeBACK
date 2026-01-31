/*
  Warnings:

  - You are about to drop the column `assessmentResultRatingId` on the `assessment_results` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "assessment_results" DROP CONSTRAINT "assessment_results_assessmentResultRatingId_fkey";

-- AlterTable
ALTER TABLE "assessment_results" RENAME COLUMN "assessmentResultRatingId" TO "assessment_result_rating_id";

-- AddForeignKey
ALTER TABLE "assessment_results" ADD CONSTRAINT "assessment_results_assessment_result_rating_id_fkey" FOREIGN KEY ("assessment_result_rating_id") REFERENCES "assessment_result_ratings"("id") ON DELETE SET NULL ON UPDATE CASCADE;
