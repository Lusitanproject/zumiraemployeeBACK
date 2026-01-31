/*
  Warnings:

  - You are about to drop the `act_conversation_messages` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `act_conversations` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "MessageRole" AS ENUM ('user', 'assistant');

-- CreateEnum
CREATE TYPE "ChapterType" AS ENUM ('REGULAR', 'ADMIN_TEST');

-- DropForeignKey
ALTER TABLE "act_conversation_messages" DROP CONSTRAINT "act_conversation_messages_act_conversation_id_fkey";

-- DropForeignKey
ALTER TABLE "act_conversations" DROP CONSTRAINT "act_conversations_act_chatbot_id_fkey";

-- DropForeignKey
ALTER TABLE "act_conversations" DROP CONSTRAINT "act_conversations_user_id_fkey";

-- DropTable
DROP TABLE "act_conversation_messages";

-- DropTable
DROP TABLE "act_conversations";

-- DropEnum
DROP TYPE "ConversationRole";

-- DropEnum
DROP TYPE "ConversationType";

-- CreateTable
CREATE TABLE "act_chapters" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT 'Novo capítulo',
    "act_chatbot_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" "ChapterType" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "act_chapters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "act_chapter_messages" (
    "id" TEXT NOT NULL,
    "act_chapter_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "role" "MessageRole" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "act_chapter_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "act_chatper_compilation" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "actChapterId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "act_chatper_compilation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "act_chapters" ADD CONSTRAINT "act_chapters_act_chatbot_id_fkey" FOREIGN KEY ("act_chatbot_id") REFERENCES "act_chatbots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "act_chapters" ADD CONSTRAINT "act_chapters_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "act_chapter_messages" ADD CONSTRAINT "act_chapter_messages_act_chapter_id_fkey" FOREIGN KEY ("act_chapter_id") REFERENCES "act_chapters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "act_chatper_compilation" ADD CONSTRAINT "act_chatper_compilation_actChapterId_fkey" FOREIGN KEY ("actChapterId") REFERENCES "act_chapters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
