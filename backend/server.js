const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // per gestire i cookie HTTPOnly
const { testConnection } = require('./src/config/db');

// IMPORTA ROTTE
const authRoutes = require('./src/routes/authRoutes');
const examRoutes = require('./src/routes/examRoutes');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARE
app.use(cors({
    origin: 'http://localhost:5173', // <-- INDIRIZZO DEL FRONTEND -->
    credentials: true 
}));

app.use(express.json()); // legge il body JSON delle richieste (es. login/register)
app.use(cookieParser()); // analizza i cookie nelle richieste in arrivo

// TEST CONNESSIONE DB
testConnection();

// ROTTE API
app.use('/api/auth', authRoutes); // rotta autenticazione (Login/Register/Logout)
app.use('/api/exams', examRoutes); // rotta esami (CRUD)

// ROTTA ROOT
app.get('/', (req, res) => {
    res.send('API StudentHub is running...');
});

// AVVIO SERVER
app.listen(PORT, () => {
    console.log(`Server in esecuzione su http://localhost:${PORT}`);
});