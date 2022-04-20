/*
  Warnings:

  - You are about to drop the column `idTelegram` on the `chat` table. All the data in the column will be lost.
  - Added the required column `idTelegramChat` to the `chat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `idTelegramMessage` to the `chat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `chat` DROP COLUMN `idTelegram`,
    ADD COLUMN `idTelegramChat` TEXT NOT NULL,
    ADD COLUMN `idTelegramMessage` TEXT NOT NULL;
