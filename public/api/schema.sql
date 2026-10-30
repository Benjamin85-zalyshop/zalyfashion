-- Base de Données Hostinger MySQL pour ZALY FASHION
-- Vous pouvez importer ce script dans phpMyAdmin ou simplement visiter https://votresite.com/api/setup.php

CREATE TABLE IF NOT EXISTS `vendors` (
    `id` VARCHAR(100) PRIMARY KEY,
    `storeName` VARCHAR(255) NOT NULL,
    `ownerName` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) DEFAULT '',
    `phone` VARCHAR(100) NOT NULL,
    `whatsapp` VARCHAR(100) DEFAULT '',
    `city` VARCHAR(255) NOT NULL,
    `district` VARCHAR(255) DEFAULT '',
    `status` ENUM('actif', 'en_attente_approbation', 'suspendu') DEFAULT 'actif',
    `isOfficialZaly` TINYINT(1) DEFAULT 0,
    `joinedAt` VARCHAR(50) NOT NULL,
    `description` TEXT,
    `productsCount` INT DEFAULT 0,
    `pinCode` VARCHAR(50) DEFAULT '1234',
    `subscriptionStatus` ENUM('trial', 'actif', 'expire', 'en_attente_validation') DEFAULT 'trial',
    `trialStartedAt` VARCHAR(50) NULL,
    `trialEndsAt` VARCHAR(50) NULL,
    `annualFee` INT DEFAULT 300000,
    `expiresAt` VARCHAR(50) NULL,
    `lastPaymentDate` VARCHAR(50) NULL,
    `paymentRef` VARCHAR(100) NULL,
    `paymentMethod` VARCHAR(50) NULL,
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `products` (
    `id` VARCHAR(100) PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `gender` ENUM('homme', 'femme', 'mixte') NOT NULL DEFAULT 'homme',
    `category` VARCHAR(100) NOT NULL,
    `categoryLabel` VARCHAR(255) NOT NULL,
    `price` INT NOT NULL,
    `originalPrice` INT NULL,
    `isPromo` TINYINT(1) DEFAULT 0,
    `isNew` TINYINT(1) DEFAULT 1,
    `isPopular` TINYINT(1) DEFAULT 0,
    `inStock` TINYINT(1) DEFAULT 1,
    `stockCount` INT DEFAULT 10,
    `rating` FLOAT DEFAULT 5.0,
    `reviewCount` INT DEFAULT 0,
    `images` TEXT NOT NULL,
    `description` TEXT,
    `composition` VARCHAR(255) DEFAULT '',
    `careInstructions` VARCHAR(255) DEFAULT '',
    `sizes` VARCHAR(255) DEFAULT 'M, L, XL',
    `colors` TEXT,
    `sku` VARCHAR(100) DEFAULT '',
    `vendorId` VARCHAR(100) DEFAULT 'vendor-zaly',
    `vendorName` VARCHAR(255) DEFAULT 'ZALY FASHION Officiel',
    `isOfficial` TINYINT(1) DEFAULT 1,
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `orders` (
    `id` VARCHAR(100) PRIMARY KEY,
    `createdAt` VARCHAR(50) NOT NULL,
    `customerName` VARCHAR(255) NOT NULL,
    `customerPhone` VARCHAR(100) NOT NULL,
    `customerWhatsapp` VARCHAR(100) DEFAULT '',
    `customerCity` VARCHAR(255) NOT NULL,
    `customerDistrict` VARCHAR(255) NOT NULL,
    `customerAddress` TEXT NOT NULL,
    `customerNotes` TEXT,
    `items` LONGTEXT NOT NULL,
    `subtotal` INT NOT NULL,
    `shippingFee` INT NOT NULL,
    `discountAmount` INT DEFAULT 0,
    `total` INT NOT NULL,
    `paymentMethod` VARCHAR(50) NOT NULL,
    `transactionRef` VARCHAR(100) NULL,
    `status` ENUM('en_attente', 'confirmee', 'en_livraison', 'livree', 'annulee') DEFAULT 'en_attente',
    `isPaid` TINYINT(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `users` (
    `id` VARCHAR(100) PRIMARY KEY,
    `fullName` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(100) NOT NULL,
    `passwordHash` VARCHAR(255) NOT NULL,
    `role` ENUM('client', 'admin') DEFAULT 'client',
    `city` VARCHAR(255) DEFAULT 'Conakry',
    `district` VARCHAR(255) DEFAULT '',
    `address` TEXT,
    `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
