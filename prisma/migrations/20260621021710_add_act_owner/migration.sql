-- AlterTable
ALTER TABLE "act_chatbots" ADD COLUMN     "owner_id" TEXT;

-- AddForeignKey
ALTER TABLE "act_chatbots" ADD CONSTRAINT "act_chatbots_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
