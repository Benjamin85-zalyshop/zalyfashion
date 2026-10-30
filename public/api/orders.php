<?php
/**
 * API REST Commandes pour ZALY FASHION (Hostinger MySQL)
 */

require_once __DIR__ . '/config.php';

$pdo = getDBConnection();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Récupérer les commandes
        $phone = isset($_GET['phone']) ? trim($_GET['phone']) : null;
        $orderId = isset($_GET['id']) ? trim($_GET['id']) : null;

        if ($orderId) {
            $stmt = $pdo->prepare("SELECT * FROM `orders` WHERE `id` = ?");
            $stmt->execute([$orderId]);
            $orders = $stmt->fetchAll();
        } elseif ($phone) {
            $stmt = $pdo->prepare("SELECT * FROM `orders` WHERE `customerPhone` = ? ORDER BY `createdAt` DESC");
            $stmt->execute([$phone]);
            $orders = $stmt->fetchAll();
        } else {
            $stmt = $pdo->query("SELECT * FROM `orders` ORDER BY `createdAt` DESC");
            $orders = $stmt->fetchAll();
        }

        $formatted = array_map(function($o) {
            $items = json_decode($o['items'], true);
            if (!is_array($items)) {
                $items = [];
            }

            return [
                'id'            => $o['id'],
                'createdAt'     => $o['createdAt'],
                'customer'      => [
                    'fullName'  => $o['customerName'],
                    'phone'     => $o['customerPhone'],
                    'whatsapp'  => $o['customerWhatsapp'] ?? $o['customerPhone'],
                    'city'      => $o['customerCity'],
                    'district'  => $o['customerDistrict'],
                    'address'   => $o['customerAddress'],
                    'notes'     => $o['customerNotes'] ?? ''
                ],
                'items'         => $items,
                'subtotal'      => (int)$o['subtotal'],
                'shippingFee'   => (int)$o['shippingFee'],
                'discountAmount'=> (int)$o['discountAmount'],
                'total'         => (int)$o['total'],
                'paymentMethod' => $o['paymentMethod'],
                'paymentDetails'=> [
                    'transactionRef' => $o['transactionRef'] ?? ''
                ],
                'status'        => $o['status'],
                'isPaid'        => (bool)$o['isPaid'],
                'serverVerified'=> true
            ];
        }, $orders);

        echo json_encode([
            'success' => true,
            'orders'  => $formatted
        ]);
        break;

    case 'POST':
        // Enregistrer une nouvelle commande ou mettre à jour un statut
        $input = json_decode(file_get_contents('php://input'), true);

        if (!$input) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Données invalides']);
            exit;
        }

        if (isset($input['action']) && $input['action'] === 'update_status') {
            $orderId = $input['orderId'] ?? '';
            $status = $input['status'] ?? '';
            $isPaid = isset($input['isPaid']) ? (int)$input['isPaid'] : null;

            if ($isPaid !== null) {
                $stmt = $pdo->prepare("UPDATE `orders` SET `status` = ?, `isPaid` = ? WHERE `id` = ?");
                $stmt->execute([$status, $isPaid, $orderId]);
            } else {
                $stmt = $pdo->prepare("UPDATE `orders` SET `status` = ? WHERE `id` = ?");
                $stmt->execute([$status, $orderId]);
            }

            echo json_encode(['success' => true, 'message' => 'Statut de commande mis à jour']);
            exit;
        }

        // Insertion d'une nouvelle commande
        $id = $input['id'] ?? ('ZLY-' . date('Y') . '-' . rand(1000, 9999));
        $createdAt = $input['createdAt'] ?? date('c');
        $customer = $input['customer'] ?? [];
        $items = json_encode($input['items'] ?? []);
        $subtotal = (int)($input['subtotal'] ?? 0);
        $shippingFee = (int)($input['shippingFee'] ?? 0);
        $discountAmount = (int)($input['discountAmount'] ?? 0);
        $total = (int)($input['total'] ?? 0);
        $paymentMethod = $input['paymentMethod'] ?? 'cod';
        $transactionRef = $input['paymentDetails']['transactionRef'] ?? ($input['transactionRef'] ?? null);
        $status = $input['status'] ?? 'en_attente';
        $isPaid = !empty($input['isPaid']) ? 1 : 0;

        $stmt = $pdo->prepare("INSERT INTO `orders`
            (`id`, `createdAt`, `customerName`, `customerPhone`, `customerWhatsapp`, `customerCity`, `customerDistrict`, `customerAddress`, `customerNotes`, `items`, `subtotal`, `shippingFee`, `discountAmount`, `total`, `paymentMethod`, `transactionRef`, `status`, `isPaid`)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE `status` = VALUES(`status`), `isPaid` = VALUES(`isPaid`)");

        $stmt->execute([
            $id,
            $createdAt,
            $customer['fullName'] ?? 'Client ZALY',
            $customer['phone'] ?? '',
            $customer['whatsapp'] ?? ($customer['phone'] ?? ''),
            $customer['city'] ?? 'Conakry',
            $customer['district'] ?? '',
            $customer['address'] ?? '',
            $customer['notes'] ?? '',
            $items,
            $subtotal,
            $shippingFee,
            $discountAmount,
            $total,
            $paymentMethod,
            $transactionRef,
            $status,
            $isPaid
        ]);

        echo json_encode([
            'success' => true,
            'message' => 'Commande enregistrée avec succès dans Hostinger MySQL',
            'orderId' => $id
        ]);
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Méthode non autorisée']);
        break;
}
