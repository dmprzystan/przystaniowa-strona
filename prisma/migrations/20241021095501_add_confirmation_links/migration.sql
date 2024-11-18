-- CreateTable
CREATE TABLE "ConfirmationLink" (
    "id" STRING NOT NULL,
    "title" STRING NOT NULL,
    "url" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConfirmationLink_pkey" PRIMARY KEY ("id")
);
