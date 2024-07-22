/*
  Warnings:

  - You are about to drop the column `coverUrl` on the `Trip` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Trip` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Trip" DROP COLUMN "coverUrl";
ALTER TABLE "Trip" DROP COLUMN "price";

-- CreateTable
CREATE TABLE "TripPhoto" (
    "id" STRING NOT NULL,
    "url" STRING NOT NULL,
    "tripId" STRING NOT NULL,

    CONSTRAINT "TripPhoto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TripLink" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "url" STRING NOT NULL,
    "tripId" STRING NOT NULL,

    CONSTRAINT "TripLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TripAttachment" (
    "id" STRING NOT NULL,
    "url" STRING NOT NULL,
    "tripId" STRING NOT NULL,

    CONSTRAINT "TripAttachment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TripPhoto" ADD CONSTRAINT "TripPhoto_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripLink" ADD CONSTRAINT "TripLink_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TripAttachment" ADD CONSTRAINT "TripAttachment_tripId_fkey" FOREIGN KEY ("tripId") REFERENCES "Trip"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
