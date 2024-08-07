/*
  Warnings:

  - A unique constraint covering the columns `[thumbnailForAlbumId]` on the table `AlbumPhoto` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "AlbumPhoto" ADD COLUMN     "thumbnailForAlbumId" STRING;

-- CreateIndex
CREATE UNIQUE INDEX "AlbumPhoto_thumbnailForAlbumId_key" ON "AlbumPhoto"("thumbnailForAlbumId");

-- AddForeignKey
ALTER TABLE "AlbumPhoto" ADD CONSTRAINT "AlbumPhoto_thumbnailForAlbumId_fkey" FOREIGN KEY ("thumbnailForAlbumId") REFERENCES "Album"("id") ON DELETE SET NULL ON UPDATE CASCADE;
