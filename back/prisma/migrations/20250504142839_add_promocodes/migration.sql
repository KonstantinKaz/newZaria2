-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "promocode_id" TEXT;

-- CreateTable
CREATE TABLE "promocodes" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "discount" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "validUntil" TIMESTAMP(3),
    "maxUses" INTEGER,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "promocodes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "promocodes_code_key" ON "promocodes"("code");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_promocode_id_fkey" FOREIGN KEY ("promocode_id") REFERENCES "promocodes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
