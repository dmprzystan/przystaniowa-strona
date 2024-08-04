-- CreateEnum
CREATE TYPE "AlbumPhotoSize" AS ENUM ('NORMAL', 'WIDE', 'TALL', 'BIG');

-- AlterTable
ALTER TABLE "AlbumPhoto" ADD COLUMN     "size" "AlbumPhotoSize" NOT NULL DEFAULT 'NORMAL';
