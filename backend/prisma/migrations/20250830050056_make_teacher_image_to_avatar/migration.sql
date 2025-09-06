/*
  Warnings:

  - You are about to drop the column `image` on the `Teacher` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Teacher" DROP COLUMN "image",
ADD COLUMN     "avatar" TEXT;
