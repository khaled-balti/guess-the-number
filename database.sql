CREATE DATABASE guess_the_number_game;

USE guess_the_number_game;

-- Table to store user information
CREATE TABLE user (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

-- Table to store game history
CREATE TABLE game_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    winner_id INT NOT NULL,
    loser_id INT NOT NULL,
    game_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (winner_id) REFERENCES user(id),
    FOREIGN KEY (loser_id) REFERENCES user(id)
);
