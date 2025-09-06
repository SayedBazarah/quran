-- DropForeignKey
ALTER TABLE "Student" DROP CONSTRAINT "Student_branchId_fkey";

-- AlterTable
ALTER TABLE "Student" ALTER COLUMN "branchId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;
