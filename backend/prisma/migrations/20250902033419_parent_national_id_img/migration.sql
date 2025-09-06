/*
  Warnings:

  - You are about to drop the column `nationalIdImage` on the `Parent` table. All the data in the column will be lost.
  - You are about to drop the column `firedBy` on the `Student` table. All the data in the column will be lost.
  - You are about to drop the column `teacherId` on the `Student` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[studentId]` on the table `Parent` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nationalIdImg` to the `Parent` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_parentId_fkey";

-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_teacherId_fkey";

-- AlterTable
ALTER TABLE "Parent" DROP COLUMN "nationalIdImage",
ADD COLUMN     "nationalIdImg" TEXT NOT NULL,
ADD COLUMN     "studentId" TEXT;

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "firedBy",
DROP COLUMN "teacherId",
ADD COLUMN     "firedById" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Parent_studentId_key" ON "Parent"("studentId");

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_firedById_fkey" FOREIGN KEY ("firedById") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parent" ADD CONSTRAINT "Parent_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;
