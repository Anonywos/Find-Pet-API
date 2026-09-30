/*
  Warnings:

  - You are about to drop the column `pETId` on the `pet_images` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "pet_images" DROP CONSTRAINT "pet_images_pETId_fkey";

-- AlterTable
ALTER TABLE "pet_images" DROP COLUMN "pETId",
ADD COLUMN     "petId" TEXT;

-- AddForeignKey
ALTER TABLE "pet_images" ADD CONSTRAINT "pet_images_petId_fkey" FOREIGN KEY ("petId") REFERENCES "pets"("id") ON DELETE SET NULL ON UPDATE CASCADE;
