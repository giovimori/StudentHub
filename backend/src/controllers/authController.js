const { pool } = require('../config/db');
const bcrypt = require('bcrypt');
const { sendTokenResponse } = require('../utils/jwt'); // Importiamo l'utility

// --- REGISTRAZIONE ---
exports.register = async (req, res) => {
    try {
        const { nome, cognome, email, password } = req.body;

        // 1. Validazione
        if (!nome || !cognome || !email || !password) {
            return res.status(400).json({ message: 'Tutti i campi sono obbligatori' });
        }

        // 2. Controllo duplicati
        const [existingUsers] = await pool.query('SELECT * FROM utenti WHERE email = ?', [email]);
        if (existingUsers.length > 0) {
            return res.status(409).json({ message: 'Email già registrata' });
        }

        // 3. Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Inserimento
        const [result] = await pool.query(
            'INSERT INTO utenti (nome, cognome, email, password) VALUES (?, ?, ?, ?)',
            [nome, cognome, email, hashedPassword]
        );

        // Costruiamo l'oggetto utente per il token
        const user = {
            id: result.insertId,
            nome,
            cognome,
            email,
            ruolo: '0', // Default
            xp_totali: 0
        };

        // 5. Invio Token (Login automatico)
        sendTokenResponse(user, 201, res);

    } catch (error) {
        console.error('Errore register:', error);
        res.status(500).json({ message: 'Errore del server' });
    }
};

// --- LOGIN ---
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Validazione
        if (!email || !password) {
            return res.status(400).json({ message: 'Inserisci email e password' });
        }

        // 2. Cerca utente (e prendi anche la password hashata)
        const [users] = await pool.query('SELECT * FROM utenti WHERE email = ?', [email]);
        const user = users[0];

        // 3. Verifica utente e password
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Credenziali non valide' });
        }

        // 4. Invio Token
        sendTokenResponse(user, 200, res);

    } catch (error) {
        console.error('Errore login:', error);
        res.status(500).json({ message: 'Errore del server' });
    }
};

// --- LOGOUT ---
exports.logout = (req, res) => {
    // Per il logout basta cancellare il cookie
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000), // Scade tra 10 secondi
        httpOnly: true
    });

    res.status(200).json({ success: true, message: 'Logout effettuato' });
};