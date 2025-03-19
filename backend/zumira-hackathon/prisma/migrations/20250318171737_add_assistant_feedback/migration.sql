-- AlterTable
ALTER TABLE "self_monitoring_blocks" ADD COLUMN     "openaiAssistantId" TEXT;

-- CreateTable
CREATE TABLE "self_monitoring_feedback" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "self_monitoring_block_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "self_monitoring_feedback_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "self_monitoring_feedback" ADD CONSTRAINT "self_monitoring_feedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "self_monitoring_feedback" ADD CONSTRAINT "self_monitoring_feedback_self_monitoring_block_id_fkey" FOREIGN KEY ("self_monitoring_block_id") REFERENCES "self_monitoring_blocks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
