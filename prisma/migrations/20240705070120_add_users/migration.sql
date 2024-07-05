-- CreateTable
CREATE TABLE "User" (
    "id" STRING NOT NULL,
    "login" STRING NOT NULL,
    "password" STRING NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
