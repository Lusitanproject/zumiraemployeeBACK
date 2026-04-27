-- AlterTable
ALTER TABLE "users" ADD COLUMN     "admission_date" TIMESTAMP(3),
ADD COLUMN     "area" TEXT,
ADD COLUMN     "custom_id" TEXT,
ADD COLUMN     "has_disability" BOOLEAN,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "occupation_level" TEXT,
ADD COLUMN     "skinColor" TEXT;
