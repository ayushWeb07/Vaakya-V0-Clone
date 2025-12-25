-- AlterTable
ALTER TABLE "Fragment" ADD COLUMN     "creditsSpent" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "workedFor" TEXT NOT NULL DEFAULT '';
