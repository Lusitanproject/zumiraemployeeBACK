-- CreateTable
CREATE TABLE "companies_assessments" (
    "company_id" TEXT NOT NULL,
    "assessment_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "companies_assessments_pkey" PRIMARY KEY ("company_id","assessment_id")
);
