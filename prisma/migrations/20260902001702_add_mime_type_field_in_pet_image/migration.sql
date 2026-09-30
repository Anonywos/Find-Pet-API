/*
  Warnings:

  - Added the required column `mime_type` to the `pet_images` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pet_images" ADD COLUMN     "mime_type" TEXT NOT NULL;
