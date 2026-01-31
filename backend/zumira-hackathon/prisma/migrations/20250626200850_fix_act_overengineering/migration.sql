/*
  Warnings:

  - You are about to drop the column `next_act_chatbot_id` on the `act_chatbots` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "act_chatbots" DROP CONSTRAINT "act_chatbots_next_act_chatbot_id_fkey";

-- AlterTable
ALTER TABLE "act_chatbots" DROP COLUMN "next_act_chatbot_id",
ADD COLUMN     "index" INTEGER NOT NULL DEFAULT 0;
