<?php
/**
 * API REST Vendeurs & Boutiques pour ZALY FASHION (Hostinger MySQL)
 */

require_once __DIR__ . '/config.php';

$pdo = getDBConnection();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Récupérer la liste des boutiques
        $stmt = $pdo->query("SELECT * FROM `vendors` ORDER BY `isOfficialZaly` DESC, `createdAt` DESC");
        $vendors = $stmt->fetchAll();

        // Formater le résultat pour React
        $formatted = array_map(function($v) {
            return [
                'id'            => $v['id'],
                'storeName'     => $v['storeName'],
                'ownerName'     => $v['ownerName'],
                'email'         => $v['email'],
                'phone'         => $v['phone'],
                'whatsapp'      => $v['whatsapp'] ?: $v['phone'],
                'city'          => $v['city'],
                'district'      => $v['district'],
                'status'        => $v['status'],
                'isOfficialZaly'=> (bool)$v['isOfficialZaly'],
                'joinedAt'      => $v['joinedAt'],
                'description'   => $v['description'],
                'productsCount' => (int)$v['productsCount'],
                'pinCode'       => $v['pinCode'],
                'subscription'  => [
                    'status'         => $v['subscriptionStatus'],
                    'trialStartedAt' => $v['trialStartedAt'],
                    'trialEndsAt'    => $v['trialEndsAt'],
                    'annualFee'      => (int)$v['annualFee'],
                    'expiresAt'      => $v['expiresAt'],
                    'lastPaymentDate'=> $v['lastPaymentDate'],
                    'paymentRef'     => $v['paymentRef'],
                    'paymentMethod'  => $v['paymentMethod']
                ]
            ];
        }, $vendors);

        echo json_encode(['success' => true, 'vendors' => $formatted]);
        break;

    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);

        // Action de paiement de l'abonnement
        if (isset($data['action']) && $data['action'] === 'pay_subscription') {
            $vendorId = $data['vendorId'] ?? '';
            $methodPay = $data['paymentMethod'] ?? 'orange_money';
            $ref = $data['paymentRef'] ?? '';
            $now = date('c');
            $nextYear = date('c', strtotime('+1 year'));

            $stmt = $pdo->prepare("UPDATE `vendors` SET 
                `subscriptionStatus` = 'actif',
                `lastPaymentDate` = ?,
                `expiresAt` = ?,
                `paymentRef` = ?,
                `paymentMethod` = ?,
                `status` = 'actif'
                WHERE `id` = ?");
            $stmt->execute([$now, $nextYear, $ref, $methodPay, $vendorId]);

            echo json_encode(['success' => true, 'message' => 'Abonnement validé pour 1 an !']);
            break;
        }

        // Inscription d'une nouvelle boutique
        $id = 'vendor-' . time() . '-' . rand(100, 999);
        $storeName = trim($data['storeName'] ?? '');
        $ownerName = trim($data['ownerName'] ?? '');
        $phone = trim($data['phone'] ?? '');
        $whatsapp = trim($data['whatsapp'] ?? $phone);
        $email = trim($data['email'] ?? '');
        $city = trim($data['city'] ?? 'Conakry');
        $district = trim($data['district'] ?? '');
        $desc = trim($data['description'] ?? '');
        $pin = trim($data['pinCode'] ?? '1234');

        $now = date('c');
        $trialEnd = date('c', strtotime('+60 days')); // 2 mois d'essai offerts

        $stmt = $pdo->prepare("INSERT INTO `vendors` 
            (`id`, `storeName`, `ownerName`, `email`, `phone`, `whatsapp`, `city`, `district`, `status`, `isOfficialZaly`, `joinedAt`, `description`, `productsCount`, `pinCode`, `subscriptionStatus`, `trialStartedAt`, `trialEndsAt`, `annualFee`)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'actif', 0, ?, ?, 0, ?, 'trial', ?, ?, 300000)");

        $stmt->execute([
            $id, $storeName, $ownerName, $email, $phone, $whatsapp, $city, $district,
            date('Y-m-d'), $desc, $pin, $now, $trialEnd
        ]);

        echo json_encode([
            'success' => true,
            'message' => 'Boutique enregistrée avec succès avec 2 mois d\'essai offerts !',
            'vendor'  => [
                'id' => $id,
                'storeName' => $storeName,
                'ownerName' => $ownerName,
                'phone' => $phone,
                'whatsapp' => $whatsapp,
                'city' => $city,
                'district' => $district,
                'status' => 'actif',
                'isOfficialZaly' => false,
                'joinedAt' => date('Y-m-d'),
                'description' => $desc,
                'productsCount' => 0,
                'pinCode' => $pin,
                'subscription' => [
                    'status' => 'trial',
                    'trialStartedAt' => $now,
                    'trialEndsAt' => $trialEnd,
                    'annualFee' => 300000
                ]
            ]
        ]);
        break;

    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        $vendorId = $data['id'] ?? '';
        if (!$vendorId) {
            http_response_code(400);
            echo json_encode(['success' => false, 'message' => 'ID manquant']);
            exit();
        }

        $fields = [];
        $values = [];

        if (isset($data['storeName'])) { $fields[] = "`storeName` = ?"; $values[] = $data['storeName']; }
        if (isset($data['ownerName'])) { $fields[] = "`ownerName` = ?"; $values[] = $data['ownerName']; }
        if (isset($data['phone'])) { $fields[] = "`phone` = ?"; $values[] = $data['phone']; }
        if (isset($data['whatsapp'])) { $fields[] = "`whatsapp` = ?"; $values[] = $data['whatsapp']; }
        if (isset($data['city'])) { $fields[] = "`city` = ?"; $values[] = $data['city']; }
        if (isset($data['district'])) { $fields[] = "`district` = ?"; $values[] = $data['district']; }
        if (isset($data['description'])) { $fields[] = "`description` = ?"; $values[] = $data['description']; }
        if (isset($data['status'])) { $fields[] = "`status` = ?"; $values[] = $data['status']; }

        if (!empty($fields)) {
            $values[] = $vendorId;
            $stmt = $pdo->prepare("UPDATE `vendors` SET " . implode(', ', $fields) . " WHERE `id` = ?");
            $stmt->execute($values);
        }

        echo json_encode(['success' => true, 'message' => 'Boutique mise à jour']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Méthode non autorisée']);
        break;
}
