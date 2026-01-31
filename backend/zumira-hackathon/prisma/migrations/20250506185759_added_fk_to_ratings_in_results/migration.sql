-- AddForeignKey
ALTER TABLE "assessment_results" ADD CONSTRAINT "assessment_results_resultRatingId_fkey" FOREIGN KEY ("resultRatingId") REFERENCES "result_ratings"("id") ON DELETE SET NULL ON UPDATE CASCADE;
