<?php
require 'db.php';

header('Content-Type: application/json'); // Ensure JSON response
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Decode JSON input
    $input = json_decode(file_get_contents('php://input'), true);
    $fullName = $input['full_name'];
    $username = $input['username'];
    $password = password_hash($input['password'], PASSWORD_BCRYPT);

    // Check if username exists
    $stmt = $pdo->prepare("SELECT * FROM user WHERE username = ?");
    $stmt->execute([$username]);
    if ($stmt->rowCount() > 0) {
        echo json_encode(["success" => false, "message" => "Username already exists."]);
        exit;
    }

    // Insert user into database
    $stmt = $pdo->prepare("INSERT INTO user (full_name, username, password) VALUES (?, ?, ?)");
    $success = $stmt->execute([$fullName, $username, $password]);

    echo json_encode([
        "success" => $success,
        "message" => $success ? "User registered successfully!" : "Failed to register user."
    ]);
}
?>