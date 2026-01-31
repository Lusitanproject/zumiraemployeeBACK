-- DropForeignKey
ALTER TABLE "assessment_questions" DROP CONSTRAINT "assessment_questions_assessment_id_fkey";

-- AddForeignKey
ALTER TABLE "assessment_questions" ADD CONSTRAINT "assessment_questions_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
