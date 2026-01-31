-- DropForeignKey
ALTER TABLE "company_assessment_feedback" DROP CONSTRAINT "company_assessment_feedback_assessment_id_fkey";

-- AddForeignKey
ALTER TABLE "company_assessment_feedback" ADD CONSTRAINT "company_assessment_feedback_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
