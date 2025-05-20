/*
  Warnings:

  - You are about to alter the column `lastAttemptAt` on the `active_mandates` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to alter the column `lastNotificationAttempt` on the `active_mandates` table. The data in that column could be lost. The data in that column will be cast from `Timestamp(0)` to `Timestamp`.
  - You are about to drop the column `billingAddress` on the `billing_details` table. All the data in the column will be lost.
  - You are about to alter the column `end_date` on the `organisation` table. The data in that column could be lost. The data in that column will be cast from `DateTime(0)` to `DateTime`.
  - Added the required column `billingName` to the `billing_details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `billingPhone` to the `billing_details` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `active_mandates` MODIFY `lastAttemptAt` TIMESTAMP NULL,
    MODIFY `lastNotificationAttempt` TIMESTAMP NULL;

-- AlterTable
ALTER TABLE `billing_details` DROP COLUMN `billingAddress`,
    ADD COLUMN `billingEmail` VARCHAR(191) NULL,
    ADD COLUMN `billingName` VARCHAR(191) NOT NULL,
    ADD COLUMN `billingPhone` VARCHAR(191) NOT NULL,
    ADD COLUMN `city` VARCHAR(191) NULL,
    ADD COLUMN `district` VARCHAR(191) NULL,
    ADD COLUMN `flat_no` VARCHAR(191) NULL,
    ADD COLUMN `pincode` VARCHAR(191) NULL,
    ADD COLUMN `state` VARCHAR(191) NULL,
    ADD COLUMN `street` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `organisation` MODIFY `end_date` DATETIME NOT NULL;
