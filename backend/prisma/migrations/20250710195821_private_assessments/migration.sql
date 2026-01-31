-- AlterTable
ALTER TABLE "assessments" ADD COLUMN "public" BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE "assessments" ALTER COLUMN "public" SET DEFAULT false;
