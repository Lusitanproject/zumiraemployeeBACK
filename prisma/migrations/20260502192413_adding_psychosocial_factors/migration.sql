-- CreateTable
CREATE TABLE "psychosocial_factors" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "wheight" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "self_monitoring_block_id" TEXT NOT NULL,

    CONSTRAINT "psychosocial_factors_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "psychosocial_factors" ADD CONSTRAINT "psychosocial_factors_self_monitoring_block_id_fkey" FOREIGN KEY ("self_monitoring_block_id") REFERENCES "self_monitoring_blocks"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
