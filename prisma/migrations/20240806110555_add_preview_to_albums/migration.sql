/*
  Warnings:

  - Added the required column `preview` to the `AlbumPhoto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AlbumPhoto" ADD COLUMN     "preview" STRING NOT NULL;
