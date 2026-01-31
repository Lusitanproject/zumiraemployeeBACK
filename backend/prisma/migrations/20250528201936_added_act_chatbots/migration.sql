-- CreateEnum
CREATE TYPE "ConversationRole" AS ENUM ('USER', 'SYSTEM');

-- AlterTable
ALTER TABLE "nationalities" ALTER COLUMN "updated_at" DROP DEFAULT;

-- CreateTable
CREATE TABLE "act_chatbots" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "index" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "act_chatbots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "act_conversations" (
    "id" TEXT NOT NULL,
    "act_chatbot_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "act_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "act_conversation_messages" (
    "id" TEXT NOT NULL,
    "act_conversation_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "role" "ConversationRole" NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "act_conversation_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "act_chatbots_index_key" ON "act_chatbots"("index");

-- AddForeignKey
ALTER TABLE "act_conversations" ADD CONSTRAINT "act_conversations_act_chatbot_id_fkey" FOREIGN KEY ("act_chatbot_id") REFERENCES "act_chatbots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "act_conversations" ADD CONSTRAINT "act_conversations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "act_conversation_messages" ADD CONSTRAINT "act_conversation_messages_act_conversation_id_fkey" FOREIGN KEY ("act_conversation_id") REFERENCES "act_conversations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
