-- AlterTable
ALTER TABLE "act_chatbots" ADD COLUMN     "bioanalysis_instructions" TEXT,
ADD COLUMN     "company_id" TEXT,
ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT true;

-- AddForeignKey
ALTER TABLE "act_chatbots" ADD CONSTRAINT "act_chatbots_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;
