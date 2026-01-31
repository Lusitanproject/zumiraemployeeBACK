/*
  Warnings:

  - You are about to drop the `companies_assessments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "companies_assessments";

-- CreateTable
CREATE TABLE "companies_available_assessments" (
    "company_id" TEXT NOT NULL,
    "assessment_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_available_assessments_pkey" PRIMARY KEY ("company_id","assessment_id")
);

-- AddForeignKey
ALTER TABLE "companies_available_assessments" ADD CONSTRAINT "companies_available_assessments_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "companies_available_assessments" ADD CONSTRAINT "companies_available_assessments_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "assessments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
