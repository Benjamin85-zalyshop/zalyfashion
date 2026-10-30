<?php
/**
 * API REST Utilisateurs & Comptes (Clients & Administrateurs)
 * ZALY FASHION - Hostinger MySQL
 */

require_once __DIR__ . '/config.php';

$pdo = getDBConnection();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        $action = $data['action'] ?? 'login';

        // 1. INSCRIPTION CLIENT
        if ($action === 'register') {
            $fullName = trim($data['fullName'] ?? '');
            $email = strtolower(trim($data['email'] ?? ''));
            $phone = trim($data['phone'] ?? '');
            $password = trim($data['password'] ?? '');
            $city = trim($data['city'] ?? 'Conakry');
            $district = trim($data['district'] ?? '');
            $address = trim($data['address'] ?? '');

            if (empty($fullName) || empty($password) || (empty($email) && empty($phone))) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Veuillez remplir tous les champs obligatoires.']);
                exit();
            }

            // Vérifier si l'utilisateur existe déjà
            $stmt = $pdo->prepare("SELECT id FROM `users` WHERE `email` = ? OR (`phone` = ? AND `phone` != '')");
            $stmt->execute([$email, $phone]);
            if ($stmt->fetch()) {
                http_response_code(409);
                echo json_encode(['success' => false, 'message' => 'Un compte existe déjà avec cet email ou ce numéro de téléphone.']);
                exit();
            }

            $id = 'usr-' . time() . '-' . rand(100, 999);
            $hash = password_hash($password, PASSWORD_DEFAULT);

            $insert = $pdo->prepare("INSERT INTO `users` 
                (`id`, `fullName`, `email`, `phone`, `passwordHash`, `role`, `city`, `district`, `address`)
                VALUES (?, ?, ?, ?, ?, 'client', ?, ?, ?)");
            $insert->execute([$id, $fullName, $email, $phone, $hash, $city, $district, $address]);

            echo json_encode([
                'success' => true,
                'message' => 'Compte créé avec succès ! Bienvenue chez ZALY FASHION.',
                'user' => [
                    'id' => $id,
                    'name' => $fullName,
                    'email' => $email,
                    'phone' => $phone,
                    'role' => 'client',
                    'city' => $city,
                    'district' => $district,
                    'address' => $address,
                    'savedOrders' => []
                ]
            ]);
            break;
        }

        // 2. CONNEXION (CLIENT OU ADMIN)
        if ($action === 'login') {
            $identifier = strtolower(trim($data['identifier'] ?? ''));
            $password = trim($data['password'] ?? '');

            if (empty($identifier) || empty($password)) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Identifiant et mot de passe requis.']);
                exit();
            }

            // Recherche par email ou par téléphone
            $cleanPhone = preg_replace('/[^0-9]/', '', $identifier);
            $stmt = $pdo->prepare("SELECT * FROM `users` WHERE LOWER(`email`) = ? OR REPLACE(REPLACE(`phone`, ' ', ''), '+', '') LIKE ? LIMIT 1");
            $stmt->execute([$identifier, '%' . $cleanPhone . '%']);
            $user = $stmt->fetch();

            if (!$user) {
                http_response_code(401);
                echo json_encode(['success' => false, 'message' => 'Accès refusé : Identifiant ou mot de passe incorrect.']);
                exit();
            }

            // Vérification stricte du mot de passe avec password_verify
            $isPasswordValid = password_verify($password, $user['passwordHash']);

            if (!$isPasswordValid) {
                http_response_code(401);
                echo json_encode(['success' => false, 'message' => 'Accès refusé : Identifiant ou mot de passe incorrect.']);
                exit();
            }

            echo json_encode([
                'success' => true,
                'message' => 'Connexion réussie !',
                'user' => [
                    'id' => $user['id'],
                    'name' => $user['fullName'],
                    'email' => $user['email'],
                    'phone' => $user['phone'],
                    'role' => $user['role'],
                    'city' => $user['city'],
                    'district' => $user['district'],
                    'address' => $user['address'],
                    'savedOrders' => []
                ]
            ]);
            break;
        }

        // 3. CRÉATION OU MODIFICATION DU COMPTE ADMIN PERSONNEL
        if ($action === 'setup_admin') {
            $adminName = trim($data['fullName'] ?? 'Administrateur Principal');
            $adminEmail = strtolower(trim($data['email'] ?? 'admin@zalyfashion.gn'));
            $adminPhone = trim($data['phone'] ?? '+224 625 66 75 22');
            $newPassword = trim($data['password'] ?? '');

            if (empty($newPassword) || strlen($newPassword) < 4) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'Le mot de passe admin doit contenir au moins 4 caractères.']);
                exit();
            }

            $hash = password_hash($newPassword, PASSWORD_DEFAULT);

            // Vérifier si un compte admin existe déjà
            $check = $pdo->query("SELECT id FROM `users` WHERE `role` = 'admin' LIMIT 1")->fetch();
            if ($check) {
                $stmt = $pdo->prepare("UPDATE `users` SET `fullName` = ?, `email` = ?, `phone` = ?, `passwordHash` = ? WHERE `id` = ?");
                $stmt->execute([$adminName, $adminEmail, $adminPhone, $hash, $check['id']]);
                $adminId = $check['id'];
            } else {
                $adminId = 'admin-' . time();
                $stmt = $pdo->prepare("INSERT INTO `users` (`id`, `fullName`, `email`, `phone`, `passwordHash`, `role`, `city`, `district`, `address`)
                    VALUES (?, ?, ?, ?, ?, 'admin', 'Conakry', 'Kaloum', 'Siège ZALY FASHION')");
                $stmt->execute([$adminId, $adminName, $adminEmail, $adminPhone, $hash]);
            }

            echo json_encode([
                'success' => true,
                'message' => 'Compte administrateur configuré avec succès !',
                'user' => [
                    'id' => $adminId,
                    'name' => $adminName,
                    'email' => $adminEmail,
                    'phone' => $adminPhone,
                    'role' => 'admin'
                ]
            ]);
            break;
        }

        // 4. MISE À JOUR DU PROFIL
        if ($action === 'update_profile') {
            $userId = $data['id'] ?? '';
            if (empty($userId)) {
                http_response_code(400);
                echo json_encode(['success' => false, 'message' => 'ID utilisateur requis.']);
                exit();
            }

            $fullName = trim($data['fullName'] ?? '');
            $phone = trim($data['phone'] ?? '');
            $city = trim($data['city'] ?? '');
            $district = trim($data['district'] ?? '');
            $address = trim($data['address'] ?? '');

            $stmt = $pdo->prepare("UPDATE `users` SET `fullName` = ?, `phone` = ?, `city` = ?, `district` = ?, `address` = ? WHERE `id` = ?");
            $stmt->execute([$fullName, $phone, $city, $district, $address, $userId]);

            echo json_encode([
                'success' => true,
                'message' => 'Profil mis à jour avec succès.'
            ]);
            break;
        }

        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Action inconnue.']);
        break;

    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'message' => 'Méthode non autorisée.']);
        break;
}
