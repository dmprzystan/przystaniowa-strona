-- CreateTable
CREATE TABLE "Newspaper" (
    "id" STRING NOT NULL,
    "title" STRING NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "url" STRING NOT NULL,

    CONSTRAINT "Newspaper_pkey" PRIMARY KEY ("id")
);
