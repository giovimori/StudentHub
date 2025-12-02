const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');

const protect = async (req, res, next) => {
    let token;

    // Leggi il token dal cookie 'jwt'
    token = req.cookies.jwt;

    if (token) {
        try {
            // Verifica il token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Cerca l'utente nel DB (escludendo la password)
            const [users] = await pool.query('SELECT id, nome, cognome, email, ruolo, xp_totali FROM utenti WHERE id = ?', [decoded.id]);
            
            if (users.length === 0) {
                 throw new Error('Utente non trovato');
            }

            // "Attacca" l'utente alla richiesta: ora in tutti i controller successivi potrai usare req.user
            req.user = users[0];
            next();
        } catch (error) {
            console.error(error);
            res.status(401).json({ message: 'Non autorizzato, token non valido' });
        }
    } else {
        res.status(401).json({ message: 'Non autorizzato, nessun token' });
    }
};

module.exports = { protect };