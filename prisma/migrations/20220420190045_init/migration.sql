/*
  Warnings:

  - Added the required column `idTelegram` to the `chat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `chat` ADD COLUMN `idTelegram` TEXT NOT NULL;
