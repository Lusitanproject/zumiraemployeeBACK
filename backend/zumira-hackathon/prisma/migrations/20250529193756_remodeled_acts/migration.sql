/*
  Warnings:

  - You are about to drop the column `index` on the `act_chatbots` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "act_chatbots_index_key";

-- AlterTable
ALTER TABLE "act_chatbots" DROP COLUMN "index",
ADD COLUMN     "next_act_chatbot_id" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "current_act_chatbot_id" TEXT;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_current_act_chatbot_id_fkey" FOREIGN KEY ("current_act_chatbot_id") REFERENCES "act_chatbots"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "act_chatbots" ADD CONSTRAINT "act_chatbots_next_act_chatbot_id_fkey" FOREIGN KEY ("next_act_chatbot_id") REFERENCES "act_chatbots"("id") ON DELETE SET NULL ON UPDATE CASCADE;
