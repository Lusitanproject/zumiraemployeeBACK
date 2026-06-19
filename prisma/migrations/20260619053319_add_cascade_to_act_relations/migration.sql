-- DropForeignKey
ALTER TABLE "act_analysis_reports" DROP CONSTRAINT "act_analysis_reports_company_act_analysis_id_fkey";

-- DropForeignKey
ALTER TABLE "act_chapters" DROP CONSTRAINT "act_chapters_act_chatbot_id_fkey";

-- DropForeignKey
ALTER TABLE "act_messages_psychosocial_factors" DROP CONSTRAINT "act_messages_psychosocial_factors_analysis_batch_id_fkey";

-- DropForeignKey
ALTER TABLE "company_act_analyses" DROP CONSTRAINT "company_act_analyses_act_chatbot_id_fkey";

-- DropForeignKey
ALTER TABLE "company_act_analysis_batches" DROP CONSTRAINT "company_act_analysis_batches_company_act_analysis_id_fkey";

-- AddForeignKey
ALTER TABLE "act_chapters" ADD CONSTRAINT "act_chapters_act_chatbot_id_fkey" FOREIGN KEY ("act_chatbot_id") REFERENCES "act_chatbots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_act_analyses" ADD CONSTRAINT "company_act_analyses_act_chatbot_id_fkey" FOREIGN KEY ("act_chatbot_id") REFERENCES "act_chatbots"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_act_analysis_batches" ADD CONSTRAINT "company_act_analysis_batches_company_act_analysis_id_fkey" FOREIGN KEY ("company_act_analysis_id") REFERENCES "company_act_analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "act_analysis_reports" ADD CONSTRAINT "act_analysis_reports_company_act_analysis_id_fkey" FOREIGN KEY ("company_act_analysis_id") REFERENCES "company_act_analyses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "act_messages_psychosocial_factors" ADD CONSTRAINT "act_messages_psychosocial_factors_analysis_batch_id_fkey" FOREIGN KEY ("analysis_batch_id") REFERENCES "company_act_analysis_batches"("id") ON DELETE CASCADE ON UPDATE CASCADE;
