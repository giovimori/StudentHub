const { pool } = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Funzione helper per creare il cookie (Clean Code)
const generateToken = (id, res) => {
    const token = jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });

    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Solo HTTPS in produzione
        sameSite: 'strict', // Protezione CSRF
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 giorni
    });
};

exports.register = async (req, res) => {
    try {
        const { nome, cognome, email, password } = req.body;

        if (!nome || !cognome || !email || !password) {
            return res.status(400).json({ message: 'Compila tutti i campi' });
        }

        const [existing] = await pool.query('SELECT * FROM utenti WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Utente già registrato' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await pool.query(
            'INSERT INTO utenti (nome, cognome, email, password) VALUES (?, ?, ?, ?)',
            [nome, cognome, email, hashedPassword]
        );

        // Auto-login dopo la registrazione
        generateToken(result.insertId, res);

        res.status(201).json({
            id: result.insertId,
            nome,
            cognome,
            email,
            ruolo: '0',
            xp_totali: 0
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Errore del server' });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Cerca l'utente
        const [users] = await pool.query('SELECT * FROM utenti WHERE email = ?', [email]);
        const user = users[0];

        // Verifica password
        if (user && (await bcrypt.compare(password, user.password))) {
            // Genera Token e Cookie
            generateToken(user.id, res);

            res.json({
                id: user.id,
                nome: user.nome,
                cognome: user.cognome,
                email: user.email,
                ruolo: user.ruolo,
                xp_totali: user.xp_totali
            });
        } else {
            res.status(401).json({ message: 'Credenziali non valide' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Errore del server' });
    }
};

exports.logout = (req, res) => {
    // Cancella il cookie impostando una data passata
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({ message: 'Logout effettuato' });
};