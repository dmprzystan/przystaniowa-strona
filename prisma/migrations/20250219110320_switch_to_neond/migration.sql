-- CreateEnum
CREATE TYPE "crdb_internal_region" AS ENUM ('aws-eu-central-1');

-- CreateEnum
CREATE TYPE "AlbumPhotoSize" AS ENUM ('NORMAL', 'WIDE', 'TALL', 'BIG');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Config" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,

    CONSTRAINT "Config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Schedule" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "day" TEXT NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Newspaper" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "Newspaper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConfirmationLink" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConfirmationLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trip" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "dateStart" TIMESTAMP(3) NOT NULL,
    "dateEnd" TIMESTAMP(3) NOT NULL,
    "thumbnail" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TripLink" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,

    CONSTRAINT "TripLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TripAttachment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "tripId" TEXT NOT NULL,

    CONSTRAINT "TripAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Album" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Album_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlbumPhoto" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "size" "AlbumPhotoSize" NOT NULL DEFAULT 'NORMAL',
    "albumId" TEXT NOT NULL,
    "thumbnailForAlbumId" TEXT,

    CONSTRAINT "AlbumPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");

-- CreateIndex
CREATE UNIQUE INDEX "Config_key_key" ON "Config"("key");

-- CreateIndex
CREATE UNIQUE INDEX "AlbumPhoto_thumbnailForAlbumId_key" ON "AlbumPhoto"("thumbnailForAlbumId");

-- AddForeignKey
ALTER TABLE "TripLink" ADD CONSTRAINT "TripLink_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripAttachment" ADD CONSTRAINT "TripAttachment_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlbumPhoto" ADD CONSTRAINT "AlbumPhoto_albumId_fkey" FOREIGN KEY ("albumId") REFERENCES "Album"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlbumPhoto" ADD CONSTRAINT "AlbumPhoto_thumbnailForAlbumId_fkey" FOREIGN KEY ("thumbnailForAlbumId") REFERENCES "Album"("id") ON DELETE SET NULL ON UPDATE CASCADE;
