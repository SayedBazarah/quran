/*
  Warnings:

  - You are about to drop the column `image` on the `Student` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Student" DROP COLUMN "image",
ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "nationalIdImg" TEXT;
