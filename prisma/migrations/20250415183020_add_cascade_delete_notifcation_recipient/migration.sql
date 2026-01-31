-- DropForeignKey
ALTER TABLE "notification_recipients" DROP CONSTRAINT "notification_recipients_notification_id_fkey";

-- AddForeignKey
ALTER TABLE "notification_recipients" ADD CONSTRAINT "notification_recipients_notification_id_fkey" FOREIGN KEY ("notification_id") REFERENCES "notifications"("id") ON DELETE CASCADE ON UPDATE CASCADE;
