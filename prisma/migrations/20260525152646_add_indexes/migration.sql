-- CreateIndex
CREATE INDEX "act_chapter_messages_act_chapter_id_created_at_idx" ON "act_chapter_messages"("act_chapter_id", "created_at" ASC);

-- CreateIndex
CREATE INDEX "act_chapter_messages_act_chapter_id_external_id_idx" ON "act_chapter_messages"("act_chapter_id", "external_id");

-- CreateIndex
CREATE INDEX "act_chapters_user_id_act_chatbot_id_type_updated_at_idx" ON "act_chapters"("user_id", "act_chatbot_id", "type", "updated_at" DESC);
