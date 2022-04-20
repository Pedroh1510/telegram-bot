-- CreateTable
CREATE TABLE `chat` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `sugestao` VARCHAR(255) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `videoId` BIGINT UNSIGNED NULL,

    UNIQUE INDEX `id`(`id`),
    UNIQUE INDEX `chat_sugestao_key`(`sugestao`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `video` (
    `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `url` TEXT NOT NULL,
    `idChat` TEXT NULL,
    `titulo` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `id`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `chat` ADD CONSTRAINT `chat_videoId_fkey` FOREIGN KEY (`videoId`) REFERENCES `video`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
