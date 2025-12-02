const jwt = require('jsonwebtoken');

// Genera il token JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d' // Il token scade dopo 30 giorni
    });
};

// Imposta il cookie con il token
const sendTokenResponse = (user, statusCode, res) => {
    const token = generateToken(user.id);

    const options = {
        expires: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000 // 30 giorni
        ),
        httpOnly: true, // Fondamentale: impedisce accesso via JS lato client (sicurezza XSS)
        secure: process.env.NODE_ENV === 'production', // Solo su HTTPS in produzione
        sameSite: 'strict' // Protezione CSRF
    };

    res.status(statusCode)
        .cookie('token', token, options) // Nome del cookie: 'token'
        .json({
            success: true,
            user: {
                id: user.id,
                nome: user.nome,
                cognome: user.cognome,
                email: user.email,
                ruolo: user.ruolo,
                xp_totali: user.xp_totali
            }
        });
};

module.exports = { sendTokenResponse };