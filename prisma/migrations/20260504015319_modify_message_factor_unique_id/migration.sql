/*
  Warnings:

  - The primary key for the `act_messages_psychosocial_factors` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "act_messages_psychosocial_factors" DROP CONSTRAINT "act_messages_psychosocial_factors_pkey",
ADD CONSTRAINT "act_messages_psychosocial_factors_pkey" PRIMARY KEY ("message_id", "factor_id", "analysis_batch_id");
