/*
  Warnings:

  - Made the column `petId` on table `pet_images` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "pet_images" DROP CONSTRAINT "pet_images_petId_fkey";

-- AlterTable
ALTER TABLE "pet_images" ALTER COLUMN "petId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "pet_images" ADD CONSTRAINT "pet_images_petId_fkey" FOREIGN KEY ("petId") REFERENCES "pets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
