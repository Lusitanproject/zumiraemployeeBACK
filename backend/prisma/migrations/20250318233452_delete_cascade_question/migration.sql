-- DropForeignKey
ALTER TABLE "assessment_question_answers" DROP CONSTRAINT "assessment_question_answers_assessment_question_choice_id_fkey";

-- DropForeignKey
ALTER TABLE "assessment_question_answers" DROP CONSTRAINT "assessment_question_answers_assessment_question_id_fkey";

-- DropForeignKey
ALTER TABLE "assessment_question_choices" DROP CONSTRAINT "assessment_question_choices_assessment_question_id_fkey";

-- AddForeignKey
ALTER TABLE "assessment_question_answers" ADD CONSTRAINT "assessment_question_answers_assessment_question_id_fkey" FOREIGN KEY ("assessment_question_id") REFERENCES "assessment_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_question_answers" ADD CONSTRAINT "assessment_question_answers_assessment_question_choice_id_fkey" FOREIGN KEY ("assessment_question_choice_id") REFERENCES "assessment_question_choices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_question_choices" ADD CONSTRAINT "assessment_question_choices_assessment_question_id_fkey" FOREIGN KEY ("assessment_question_id") REFERENCES "assessment_questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
