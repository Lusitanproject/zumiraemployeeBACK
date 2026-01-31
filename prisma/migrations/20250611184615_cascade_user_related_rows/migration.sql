-- DropForeignKey
ALTER TABLE "act_conversations" DROP CONSTRAINT "act_conversations_user_id_fkey";

-- DropForeignKey
ALTER TABLE "assessment_question_answers" DROP CONSTRAINT "assessment_question_answers_user_id_fkey";

-- DropForeignKey
ALTER TABLE "assessment_results" DROP CONSTRAINT "assessment_results_user_id_fkey";

-- DropForeignKey
ALTER TABLE "auth_codes" DROP CONSTRAINT "auth_codes_user_id_fkey";

-- DropForeignKey
ALTER TABLE "notification_recipients" DROP CONSTRAINT "notification_recipients_user_id_fkey";

-- AddForeignKey
ALTER TABLE "auth_codes" ADD CONSTRAINT "auth_codes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_results" ADD CONSTRAINT "assessment_results_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessment_question_answers" ADD CONSTRAINT "assessment_question_answers_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_recipients" ADD CONSTRAINT "notification_recipients_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "act_conversations" ADD CONSTRAINT "act_conversations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
