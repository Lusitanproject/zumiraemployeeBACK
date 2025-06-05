-- DropForeignKey
ALTER TABLE "assessment_results" DROP CONSTRAINT "assessment_results_assessment_id_fkey";

-- DropForeignKey
ALTER TABLE "assessment_results" DROP CONSTRAINT "assessment_results_assessment_result_rating_id_fkey";

-- AddForeignKey
ALTER TABLE "assessment_results" ADD CONSTRAINT "assessment_results_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_results" ADD CONSTRAINT "assessment_results_assessment_result_rating_id_fkey" FOREIGN KEY ("assessment_result_rating_id") REFERENCES "assessment_result_ratings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
