-- AlterTable
ALTER TABLE "User" ADD COLUMN     "active_promocode_id" TEXT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_active_promocode_id_fkey" FOREIGN KEY ("active_promocode_id") REFERENCES "promocodes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
