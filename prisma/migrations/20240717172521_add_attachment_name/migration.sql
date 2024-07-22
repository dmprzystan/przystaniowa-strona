/*
  Warnings:

  - Added the required column `name` to the `TripAttachment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TripAttachment" ADD COLUMN     "name" STRING NOT NULL;
