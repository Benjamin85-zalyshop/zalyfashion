<?php
/**
 * Script d'installation automatique des tables MySQL Hostinger pour ZALY FASHION
 * Ouvrez simplement ce fichier dans votre navigateur : https://votresite.com/api/setup.php
 */

require_once __DIR__ . '/config.php';

try {
    $pdo = getDBConnection();

    // 1. Table des Boutiques & Vendeurs Partenaires
    $pdo->exec("CREATE TABLE IF NOT EXISTS `vendors` (
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

    // 2. Table des Produits & Articles en Vente
    $pdo->exec("CREATE TABLE IF NOT EXISTS `products` (
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

    // 3. Table des Commandes Clients
    $pdo->exec("CREATE TABLE IF NOT EXISTS `orders` (
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

    // 4. Table des Utilisateurs (Clients & Administrateurs)
    $pdo->exec("CREATE TABLE IF NOT EXISTS `users` (
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

    // Créer le compte admin par défaut si aucun n'existe
    $checkAdmin = $pdo->query("SELECT COUNT(*) FROM `users` WHERE `role` = 'admin'")->fetchColumn();
    if ($checkAdmin == 0) {
        $defaultHash = password_hash('1234', PASSWORD_DEFAULT);
        $stmtAdmin = $pdo->prepare("INSERT INTO `users` (`id`, `fullName`, `email`, `phone`, `passwordHash`, `role`, `city`, `district`, `address`)
            VALUES (?, ?, ?, ?, ?, 'admin', 'Conakry', 'Kaloum', 'Siège ZALY FASHION')");
        $stmtAdmin->execute(['admin-root', 'Direction ZALY FASHION', 'admin@zalyfashion.gn', '+224 625 66 75 22', $defaultHash]);
    }

    // Vérifier si la boutique principale existe, sinon l'insérer
    $checkVendor = $pdo->query("SELECT COUNT(*) FROM `vendors` WHERE `id` = 'vendor-zaly'")->fetchColumn();
    if ($checkVendor == 0) {
        $now = date('c');
        $trialEnd = date('c', strtotime('+60 days'));
        $stmt = $pdo->prepare("INSERT INTO `vendors` 
            (`id`, `storeName`, `ownerName`, `email`, `phone`, `whatsapp`, `city`, `district`, `status`, `isOfficialZaly`, `joinedAt`, `description`, `productsCount`, `pinCode`, `subscriptionStatus`, `trialStartedAt`, `trialEndsAt`, `annualFee`)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        $stmt->execute([
            'vendor-zaly',
            'ZALY FASHION Officiel',
            'Maison ZALY Guinée',
            'contact@zalyfashion.gn',
            '+224 625 66 75 22',
            '+224 625 66 75 22',
            'Conakry (Kaloum, Almamya)',
            'Kaloum',
            'actif',
            1,
            '2026-01-01',
            'Boutique amirale et créateur officiel de la collection haute couture ZALY FASHION en Guinée.',
            16,
            '1234',
            'actif',
            $now,
            $trialEnd,
            300000
        ]);
    }

    echo json_encode([
        'success' => true,
        'message' => 'Félicitations ! Les tables de la base de données Hostinger MySQL ont été créées avec succès pour ZALY FASHION.',
        'tables'  => ['vendors', 'products', 'orders'],
        'status'  => 'Prêt pour les publications en direct !'
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error'   => $e->getMessage()
    ], JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}
