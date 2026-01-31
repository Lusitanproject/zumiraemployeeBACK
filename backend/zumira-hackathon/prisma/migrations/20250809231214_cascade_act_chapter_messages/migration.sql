-- DropForeignKey
ALTER TABLE "act_chapter_messages" DROP CONSTRAINT "act_chapter_messages_act_chapter_id_fkey";

-- AddForeignKey
ALTER TABLE "act_chapter_messages" ADD CONSTRAINT "act_chapter_messages_act_chapter_id_fkey" FOREIGN KEY ("act_chapter_id") REFERENCES "act_chapters"("id") ON DELETE CASCADE ON UPDATE CASCADE;
