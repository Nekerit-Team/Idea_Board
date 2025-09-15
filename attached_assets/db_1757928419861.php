<?php
$host = "localhost";
$port = "3008";
$dbname = "ideaboard";
$user = "root";
$password = "password"; 

try {
    $pdo = new PDO("pgsql:host=$host;port=$port;dbname=$dbname", $user, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);
} catch (PDOException $e) {
    die("Error en la conexión: " . $e->getMessage());
}
?>
