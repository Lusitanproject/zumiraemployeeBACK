-- AlterTable
ALTER TABLE "assessments" ADD COLUMN     "company_id" TEXT,
ADD COLUMN     "owner_id" TEXT;

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
