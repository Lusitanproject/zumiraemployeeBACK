-- CreateEnum
CREATE TYPE "BatchStatus" AS ENUM ('PENDING', 'DONE');

-- AlterTable
ALTER TABLE "psychosocial_factors" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "company_act_analyses" (
    "id" TEXT NOT NULL,
    "act_chatbot_id" TEXT NOT NULL,
    "company_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_act_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_act_analysis_batches" (
    "id" TEXT NOT NULL,
    "company_act_analysis_id" TEXT NOT NULL,
    "batch_id" TEXT NOT NULL,
    "status" "BatchStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_act_analysis_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActMessagesPsychosocialFactors" (
    "message_id" TEXT NOT NULL,
    "factor_id" TEXT NOT NULL,
    "analysis_batch_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ActMessagesPsychosocialFactors_pkey" PRIMARY KEY ("message_id","factor_id")
);

-- AddForeignKey
ALTER TABLE "company_act_analyses" ADD CONSTRAINT "company_act_analyses_act_chatbot_id_fkey" FOREIGN KEY ("act_chatbot_id") REFERENCES "act_chatbots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_act_analyses" ADD CONSTRAINT "company_act_analyses_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_act_analysis_batches" ADD CONSTRAINT "company_act_analysis_batches_company_act_analysis_id_fkey" FOREIGN KEY ("company_act_analysis_id") REFERENCES "company_act_analyses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActMessagesPsychosocialFactors" ADD CONSTRAINT "ActMessagesPsychosocialFactors_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "act_chapter_messages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActMessagesPsychosocialFactors" ADD CONSTRAINT "ActMessagesPsychosocialFactors_factor_id_fkey" FOREIGN KEY ("factor_id") REFERENCES "psychosocial_factors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActMessagesPsychosocialFactors" ADD CONSTRAINT "ActMessagesPsychosocialFactors_analysis_batch_id_fkey" FOREIGN KEY ("analysis_batch_id") REFERENCES "company_act_analysis_batches"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
