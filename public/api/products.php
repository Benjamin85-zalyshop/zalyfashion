<?php
/**
 * API REST Produits & Catalogue pour ZALY FASHION (Hostinger MySQL)
 */

require_once __DIR__ . '/config.php';

$pdo = getDBConnection();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->query("SELECT * FROM `products` ORDER BY `createdAt` DESC");
        $products = $stmt->fetchAll();

        // Formater les listes (images, sizes, colors) stockées en JSON/CSV
        $formatted = array_map(function($p) {
            $imgs = json_decode($p['images'], true);
            if (!is_array($imgs)) {
                $imgs = explode(',', $p['images']);
            }

            $colors = json_decode($p['colors'], true);
            if (!is_array($colors)) {
                $colors = [
                    ['name' => 'Standard', 'hex' => '#111827', 'code' => 'std']
                ];
            }

            $sizes = explode(',', $p['sizes']);
            $sizes = array_map('trim', $sizes);

            return [
                'id'            => $p['id'],
                'name'          => $p['name'],
                'slug'          => $p['slug'],
                'gender'        => $p['gender'],
                'category'      => $p['category'],
                'categoryLabel' => $p['categoryLabel'],
                'price'         => (int)$p['price'],
                'originalPrice' => $p['originalPrice'] ? (int)$p['originalPrice'] : null,
                'isPromo'       => (bool)$p['isPromo'],
                'isNew'         => (bool)$p['isNew'],
                'isPopular'     => (bool)$p['isPopular'],
                'inStock'       => (bool)$p['inStock'],
                'stockCount'    => (int)$p['stockCount'],
                'rating'        => (float)$p['rating'],
                'reviewCount'   => (int)$p['reviewCount'],
                'images'        => $imgs,
                'description'   => $p['description'],
                'composition'   => $p['composition'],
                'careInstructions' => $p['careInstructions'],
                'sizes'         => $sizes,
                'colors'        => $colors,
                'sku'           => $p['sku'],
                'vendorId'      => $p['vendorId'],
                'vendorName'    => $p['vendorName'],
                'isOfficial'    => (bool)$p['isOfficial']
            ];
        }, $products);

        echo json_encode(['success' => true, 'products' => $formatted]);
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);

        $id = $data['id'] ?? ('prod-h-' . time() . '-' . rand(100, 999));
        $name = trim($data['name'] ?? 'Article ZALY');
        $slug = $data['slug'] ?? (strtolower(preg_replace('/[^a-z0-9]+/i', '-', $name)) . '-' . time());
        $gender = $data['gender'] ?? 'homme';
        $category = $data['category'] ?? 'costumes';
        $catLabel = $data['categoryLabel'] ?? strtoupper($category);
        $price = (int)($data['price'] ?? 100000);
        $origPrice = isset($data['originalPrice']) ? (int)$data['originalPrice'] : null;
        $isPromo = !empty($origPrice && $origPrice > $price) ? 1 : 0;
        $stock = (int)($data['stockCount'] ?? 10);
        $inStock = $stock > 0 ? 1 : 0;
        $images = json_encode($data['images'] ?? []);
        $desc = trim($data['description'] ?? '');
        $comp = trim($data['composition'] ?? 'Tissu raffiné haute couture');
        $care = trim($data['careInstructions'] ?? 'Lavage délicat');
        $sizes = is_array($data['sizes'] ?? null) ? implode(', ', $data['sizes']) : ($data['sizes'] ?? 'M, L, XL');
        $colors = json_encode($data['colors'] ?? [['name' => 'Standard', 'hex' => '#000', 'code' => 'std']]);
        $sku = $data['sku'] ?? ('ZLY-' . rand(1000, 9999));
        $vendorId = $data['vendorId'] ?? 'vendor-zaly';
        $vendorName = $data['vendorName'] ?? 'ZALY FASHION';
        $isOfficial = !empty($data['isOfficial']) ? 1 : 0;

        $stmt = $pdo->prepare("INSERT INTO `products` 
            (`id`, `name`, `slug`, `gender`, `category`, `categoryLabel`, `price`, `originalPrice`, `isPromo`, `isNew`, `isPopular`, `inStock`, `stockCount`, `rating`, `reviewCount`, `images`, `description`, `composition`, `careInstructions`, `sizes`, `colors`, `sku`, `vendorId`, `vendorName`, `isOfficial`)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0, ?, ?, 5.0, 0, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

        $stmt->execute([
            $id, $name, $slug, $gender, $category, $catLabel, $price, $origPrice,
            $isPromo, $inStock, $stock, $images, $desc, $comp, $care, $sizes, $colors,
            $sku, $vendorId, $vendorName, $isOfficial
        ]);

        // Mettre à jour le compteur de la boutique
        $pdo->prepare("UPDATE `vendors` SET `productsCount` = `productsCount` + 1 WHERE `id` = ?")->execute([$vendorId]);

        echo json_encode([
            'success' => true,
            'message' => 'Produit publié avec succès sur ZALY FASHION !',
            'product' => [
                'id' => $id,
                'name' => $name,
                'price' => $price,
                'category' => $category,
                'vendorId' => $vendorId
            ]
        ]);
        break;

    case 'DELETE':
        $id = $_GET['id'] ?? '';
        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'ID manquant']);
            exit();
        }

        $stmt = $pdo->prepare("DELETE FROM `products` WHERE `id` = ?");
        $stmt->execute([$id]);

        echo json_encode(['success' => true, 'message' => 'Produit retiré du catalogue']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
        break;
}
