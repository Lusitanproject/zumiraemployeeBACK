-- AlterTable
ALTER TABLE "act_chatbots" ADD COLUMN     "openai_file_id" TEXT,
ADD COLUMN     "openai_file_synced_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "assessments" ADD COLUMN     "openai_file_id" TEXT,
ADD COLUMN     "openai_file_synced_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "company_act_analyses" ADD COLUMN     "vector_store_id" TEXT;

-- AlterTable
ALTER TABLE "company_assessment_analysis" ADD COLUMN     "vector_store_id" TEXT;

-- AddForeignKey
ALTER TABLE "company_assessment_analysis" ADD CONSTRAINT "company_assessment_analysis_vector_store_id_fkey" FOREIGN KEY ("vector_store_id") REFERENCES "openai_vector_stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_act_analyses" ADD CONSTRAINT "company_act_analyses_vector_store_id_fkey" FOREIGN KEY ("vector_store_id") REFERENCES "openai_vector_stores"("id") ON DELETE SET NULL ON UPDATE CASCADE;
