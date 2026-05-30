-- AlterTable
ALTER TABLE `Notification` ADD COLUMN `is_seen` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `is_sent` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `scheduled_at` DATETIME(0) NULL,
    ADD COLUMN `seen_at` DATETIME(0) NULL;
