/*
  Warnings:

  - You are about to drop the column `color` on the `notifications` table. All the data in the column will be lost.
  - Made the column `notification_type_id` on table `notifications` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_notification_type_id_fkey";

-- AlterTable
ALTER TABLE "alerts" ADD COLUMN     "read" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "color",
ALTER COLUMN "notification_type_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_notification_type_id_fkey" FOREIGN KEY ("notification_type_id") REFERENCES "notification_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
