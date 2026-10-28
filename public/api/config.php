<?php
/**
 * Configuration de la Base de Données Hostinger MySQL pour ZALY FASHION
 * Remplacez les 4 valeurs ci-dessous avec vos identifiants créés dans le hPanel Hostinger.
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// IDENTIFIANTS MYSQL HOSTINGER (à renseigner avec vos données créées dans Hostinger > Bases de données)
define('DB_HOST', 'localhost');
define('DB_NAME', 'u123456789_zaly');      // Nom de votre base créée sur Hostinger
define('DB_USER', 'u123456789_admin');     // Nom d'utilisateur MySQL Hostinger
define('DB_PASS', 'VotreMotDePasseIci');   // Mot de passe de votre base Hostinger

function getDBConnection() {
    static $pdo = null;
    if ($pdo !== null) {
        return $pdo;
    }

    try {
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4";
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        return $pdo;
    } catch (PDOException $e) {
        // Renvoie une erreur lisible si la connexion échoue
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'message' => 'Erreur de connexion MySQL Hostinger: ' . $e->getMessage(),
            'hint'    => 'Vérifiez les identifiants DB_NAME, DB_USER et DB_PASS dans api/config.php.'
        ]);
        exit();
    }
}
