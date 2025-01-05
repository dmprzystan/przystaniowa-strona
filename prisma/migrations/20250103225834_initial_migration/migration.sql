-- CreateTable
CREATE TABLE "User" (
    "id" STRING NOT NULL,
    "login" STRING NOT NULL,
    "password" STRING NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Config" (
    "id" STRING NOT NULL,
    "key" STRING NOT NULL,
    "value" JSONB NOT NULL,

    CONSTRAINT "Config_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");

-- CreateIndex
CREATE UNIQUE INDEX "Config_key_key" ON "Config"("key");
