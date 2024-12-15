<?php
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];

    // Find user by username
    $stmt = $pdo->prepare("SELECT * FROM user WHERE username = ?");
    $stmt->execute([$username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password'])) {
        echo json_encode([
            "success" => true,
            "message" => "Login successful!",
            "user" => [
                "id" => $user['id'],
                "full_name" => $user['full_name']
            ]
        ]);
    } else {
        echo json_encode(["success" => false, "message" => "Invalid username or password."]);
    }
}
?>
