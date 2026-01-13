-- 1. Creazione e Selezione del Database
CREATE DATABASE IF NOT EXISTS studenthub_db;
USE studenthub_db;

-- 2. Creazione Tabella Utenti
CREATE TABLE IF NOT EXISTS utenti (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nome VARCHAR(100) NOT NULL,
    cognome VARCHAR(100) NOT NULL,
    ruolo ENUM('0', '1', '2') NOT NULL DEFAULT '0',
    xp_totali INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Creazione Tabella Livelli
CREATE TABLE IF NOT EXISTS livelli (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero INT NOT NULL,
    nome VARCHAR(50) NOT NULL,
    descrizione VARCHAR(255),
    xp_min INT NOT NULL,
    xp_max INT NULL
);

-- 4. Creazione Tabella Esami
CREATE TABLE IF NOT EXISTS esami (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_utente INT NOT NULL,
    nome VARCHAR(100) NOT NULL,
    voto INT NOT NULL CHECK (voto >= 18 AND voto <= 30),
    lode BOOLEAN NOT NULL DEFAULT FALSE,
    cfu INT NOT NULL,
    data DATE NOT NULL,
    xp_guadagnati INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_utente) REFERENCES utenti(id) ON DELETE CASCADE
);

-- 5. Creazione Tabella Obiettivi
CREATE TABLE IF NOT EXISTS obiettivi (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    descrizione TEXT,
    xp_valore INT NOT NULL
);

-- 6. Creazione Tabella Obiettivi Sbloccati
CREATE TABLE IF NOT EXISTS obiettivi_sbloccati (
    id_utente INT NOT NULL,
    id_obiettivo INT NOT NULL,
    data_conseguimento DATE NOT NULL,
    PRIMARY KEY (id_utente, id_obiettivo),
    FOREIGN KEY (id_utente) REFERENCES utenti(id) ON DELETE CASCADE,
    FOREIGN KEY (id_obiettivo) REFERENCES obiettivi(id) ON DELETE CASCADE
);

-- 7. Creazione Tabella Impostazioni Utente
CREATE TABLE IF NOT EXISTS impostazioni_utente (
    id_utente INT PRIMARY KEY,
    tema_voti ENUM('DEFAULT', 'RGB') NOT NULL DEFAULT 'DEFAULT',
    rgb_soglia_bassa INT DEFAULT 18 CHECK (rgb_soglia_bassa >= 18 AND rgb_soglia_bassa <= 30),
    rgb_soglia_alta INT DEFAULT 27 CHECK (rgb_soglia_alta >= 18 AND rgb_soglia_alta <= 30),
    CONSTRAINT chk_soglie CHECK (rgb_soglia_bassa <= rgb_soglia_alta),
    FOREIGN KEY (id_utente) REFERENCES utenti(id) ON DELETE CASCADE
);