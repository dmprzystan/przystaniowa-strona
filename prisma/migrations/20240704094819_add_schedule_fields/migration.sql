/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `date` on the `Schedule` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Schedule` table. All the data in the column will be lost.
  - Added the required column `day` to the `Schedule` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `Schedule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "createdAt";
ALTER TABLE "Schedule" DROP COLUMN "date";
ALTER TABLE "Schedule" DROP COLUMN "updatedAt";
ALTER TABLE "Schedule" ADD COLUMN     "day" STRING NOT NULL;
ALTER TABLE "Schedule" ADD COLUMN     "time" STRING NOT NULL;
