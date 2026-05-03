/*
  Warnings:

  - You are about to drop the `ActMessagesPsychosocialFactors` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `company_act_analyses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `company_act_analysis_batches` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ActMessagesPsychosocialFactors" DROP CONSTRAINT "ActMessagesPsychosocialFactors_analysis_batch_id_fkey";

-- DropForeignKey
ALTER TABLE "ActMessagesPsychosocialFactors" DROP CONSTRAINT "ActMessagesPsychosocialFactors_factor_id_fkey";

-- DropForeignKey
ALTER TABLE "ActMessagesPsychosocialFactors" DROP CONSTRAINT "ActMessagesPsychosocialFactors_message_id_fkey";

-- DropForeignKey
ALTER TABLE "company_act_analyses" DROP CONSTRAINT "company_act_analyses_act_chatbot_id_fkey";

-- DropForeignKey
ALTER TABLE "company_act_analyses" DROP CONSTRAINT "company_act_analyses_company_id_fkey";

-- DropForeignKey
ALTER TABLE "company_act_analysis_batches" DROP CONSTRAINT "company_act_analysis_batches_company_act_analysis_id_fkey";

-- DropTable
DROP TABLE "ActMessagesPsychosocialFactors";

-- DropTable
DROP TABLE "company_act_analyses";

-- DropTable
DROP TABLE "company_act_analysis_batches";

-- DropEnum
DROP TYPE "BatchStatus";
