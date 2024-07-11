-- CreateTable
CREATE TABLE "Trip" (
    "id" STRING NOT NULL,
    "title" STRING NOT NULL,
    "description" STRING NOT NULL,
    "price" INT4 NOT NULL,
    "dateStart" TIMESTAMP(3) NOT NULL,
    "dateEnd" TIMESTAMP(3) NOT NULL,
    "coverUrl" STRING NOT NULL,

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);
