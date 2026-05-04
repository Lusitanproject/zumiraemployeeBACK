-- DropForeignKey
ALTER TABLE "act_messages_psychosocial_factors" DROP CONSTRAINT "act_messages_psychosocial_factors_message_id_fkey";

-- AddForeignKey
ALTER TABLE "act_messages_psychosocial_factors" ADD CONSTRAINT "act_messages_psychosocial_factors_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "act_chapter_messages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
