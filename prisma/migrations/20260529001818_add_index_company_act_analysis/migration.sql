-- CreateIndex
CREATE INDEX "company_act_analyses_company_id_act_chatbot_id_created_at_idx" ON "company_act_analyses"("company_id", "act_chatbot_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "company_assessment_analysis_company_id_assessment_id_create_idx" ON "company_assessment_analysis"("company_id", "assessment_id", "created_at" DESC);
