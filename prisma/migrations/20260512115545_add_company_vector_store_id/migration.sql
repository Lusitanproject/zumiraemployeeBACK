/*
  Warnings:

  - You are about to rename the column `trailId` on the `companies` table. All the data in the column will be lost.
  - You are about to rename the column `phoneNumber` on the `users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "companies" DROP CONSTRAINT "companies_trailId_fkey";

-- AlterTable
ALTER TABLE "companies" RENAME COLUMN "trailId" TO "trail_id";

ALTER TABLE "companies" ADD COLUMN "vector_store_id" TEXT;

-- AlterTable
ALTER TABLE "users" RENAME COLUMN "phoneNumber" TO "phone_number";

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_trail_id_fkey" FOREIGN KEY ("trail_id") REFERENCES "trails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
