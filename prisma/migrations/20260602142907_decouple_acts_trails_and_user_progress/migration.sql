/*
  Warnings:

  - You are about to drop the column `index` on the `act_chatbots` table. All the data in the column will be lost.
  - You are about to drop the column `trail_id` on the `act_chatbots` table. All the data in the column will be lost.
  - You are about to drop the column `current_act_chatbot_id` on the `users` table. All the data in the column will be lost.

*/

-- CreateTable (antes de migrar dados e dropar colunas)
CREATE TABLE "trail_act_chatbots" (
    "trail_id" TEXT NOT NULL,
    "act_chatbot_id" TEXT NOT NULL,
    "index" INTEGER NOT NULL,

    CONSTRAINT "trail_act_chatbots_pkey" PRIMARY KEY ("trail_id","act_chatbot_id")
);

-- CreateTable
CREATE TABLE "user_trail_progress" (
    "user_id" TEXT NOT NULL,
    "trail_id" TEXT NOT NULL,
    "current_act_chatbot_id" TEXT,
    "current_index" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "user_trail_progress_pkey" PRIMARY KEY ("user_id","trail_id")
);

-- AddForeignKey (antes dos INSERTs para garantir integridade referencial)
ALTER TABLE "trail_act_chatbots" ADD CONSTRAINT "trail_act_chatbots_trail_id_fkey" FOREIGN KEY ("trail_id") REFERENCES "trails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "trail_act_chatbots" ADD CONSTRAINT "trail_act_chatbots_act_chatbot_id_fkey" FOREIGN KEY ("act_chatbot_id") REFERENCES "act_chatbots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "user_trail_progress" ADD CONSTRAINT "user_trail_progress_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "user_trail_progress" ADD CONSTRAINT "user_trail_progress_trail_id_fkey" FOREIGN KEY ("trail_id") REFERENCES "trails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "user_trail_progress" ADD CONSTRAINT "user_trail_progress_current_act_chatbot_id_fkey" FOREIGN KEY ("current_act_chatbot_id") REFERENCES "act_chatbots"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Migrate data: atos -> junction
INSERT INTO "trail_act_chatbots" ("trail_id", "act_chatbot_id", "index")
SELECT "trail_id", "id", "index"
FROM "act_chatbots"
WHERE "trail_id" IS NOT NULL;

-- Migrate data: progresso dos usuários (company -> trail; current_index = index do ato)
-- Feito ANTES de dropar act_chatbots.index e users.current_act_chatbot_id
INSERT INTO "user_trail_progress" ("user_id", "trail_id", "current_act_chatbot_id", "current_index")
SELECT u.id, c.trail_id, u.current_act_chatbot_id, COALESCE(a."index", 0)
FROM "users" u
JOIN "companies" c ON c.id = u.company_id
LEFT JOIN "act_chatbots" a ON a.id = u.current_act_chatbot_id
WHERE c.trail_id IS NOT NULL
  AND u.current_act_chatbot_id IS NOT NULL;

-- DropForeignKey
ALTER TABLE "act_chatbots" DROP CONSTRAINT "act_chatbots_trail_id_fkey";

ALTER TABLE "users" DROP CONSTRAINT "users_current_act_chatbot_id_fkey";

-- AlterTable
ALTER TABLE "act_chatbots" DROP COLUMN "index",
DROP COLUMN "trail_id";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "current_act_chatbot_id";
