-- CreateTable
CREATE TABLE "Usage" (
    "key" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,
    "expiresOn" TIMESTAMP(3),

    CONSTRAINT "Usage_pkey" PRIMARY KEY ("key")
);
