/*
  Warnings:

  - Changed the type of `status` on the `Enrollment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "EnrollmentStatus" AS ENUM ('pending', 'active', 'late', 'end');

-- First, update all existing rows
UPDATE "Enrollment"
SET "status" = 'PENDING'
WHERE "status" IS NULL;

-- AlterTable
ALTER TABLE "Enrollment" DROP COLUMN "status",
ADD COLUMN     "status" "EnrollmentStatus" NOT NULL;

-- AlterTable
ALTER TABLE "Student" ADD COLUMN     "acceptedById" TEXT;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_acceptedById_fkey" FOREIGN KEY ("acceptedById") REFERENCES "Admin"("id") ON DELETE SET NULL ON UPDATE CASCADE;
