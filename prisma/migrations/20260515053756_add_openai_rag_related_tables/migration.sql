-- CreateTable
CREATE TABLE "openai_files" (
    "id" TEXT NOT NULL,
    "vector_store_id" TEXT NOT NULL,
    "openai_file_id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mime_type" TEXT,
    "size_bytes" BIGINT,
    "checksum" TEXT,
    "status" TEXT NOT NULL DEFAULT 'uploaded',
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "openai_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "openai_vector_stores" (
    "id" TEXT NOT NULL,
    "openai_vector_store_id" TEXT NOT NULL,
    "name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "openai_vector_stores_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "openai_files_openai_file_id_key" ON "openai_files"("openai_file_id");

-- CreateIndex
CREATE UNIQUE INDEX "openai_vector_stores_openai_vector_store_id_key" ON "openai_vector_stores"("openai_vector_store_id");

-- AddForeignKey
ALTER TABLE "openai_files" ADD CONSTRAINT "openai_files_vector_store_id_fkey" FOREIGN KEY ("vector_store_id") REFERENCES "openai_vector_stores"("id") ON DELETE CASCADE ON UPDATE CASCADE;
