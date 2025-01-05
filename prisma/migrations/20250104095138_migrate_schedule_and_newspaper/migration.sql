-- CreateTable
CREATE TABLE "Schedule" (
    "id" STRING NOT NULL,
    "title" STRING NOT NULL,
    "time" STRING NOT NULL,
    "day" STRING NOT NULL,

    CONSTRAINT "Schedule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Newspaper" (
    "id" STRING NOT NULL,
    "title" STRING NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "url" STRING NOT NULL,

    CONSTRAINT "Newspaper_pkey" PRIMARY KEY ("id")
);
