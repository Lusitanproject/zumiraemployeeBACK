-- DropForeignKey
ALTER TABLE "notifications" DROP CONSTRAINT "notifications_notification_type_id_fkey";

-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "action_url" TEXT,
ADD COLUMN     "color" TEXT,
ALTER COLUMN "content" DROP NOT NULL,
ALTER COLUMN "notification_type_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_notification_type_id_fkey" FOREIGN KEY ("notification_type_id") REFERENCES "notification_types"("id") ON DELETE SET NULL ON UPDATE CASCADE;
