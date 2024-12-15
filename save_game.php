<?php
require 'db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $winnerId = $_POST['winner_id'];
    $loserId = $_POST['loser_id'];

    // Insert game history
    $stmt = $pdo->prepare("INSERT INTO game_history (winner_id, loser_id) VALUES (?, ?)");
    $success = $stmt->execute([$winnerId, $loserId]);

    echo json_encode([
        "success" => $success,
        "message" => $success ? "Game history saved successfully!" : "Failed to save game history."
    ]);
}
?>
