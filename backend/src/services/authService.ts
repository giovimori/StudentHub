import { pool } from '../config/db';
import bcrypt from 'bcrypt';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { UserRole } from '../types/enums';

export const authService = {
    async register(userData: any) {
        const { nome, cognome, email, password } = userData;

        // 1. Verifica se l'email esiste
        const [existingUsers] = await pool.query<RowDataPacket[]>(`
            SELECT * FROM utenti WHERE email = ?
        `, [email]);

        if (existingUsers.length > 0) {
            throw new Error('Email già registrata');
        }

        // 2. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Inserimento nel DB (Utente)
        const [result] = await pool.query<ResultSetHeader>(`
            INSERT INTO utenti (nome, cognome, email, password) 
            VALUES (?, ?, ?, ?)
        `, [nome, cognome, email, hashedPassword]);

        const newUserId = result.insertId;

        // 4. Inserimento nel DB (Impostazioni di Default) - MANUALE (ex Trigger)
        await pool.query(`
            INSERT INTO impostazioni_utente (id_utente) VALUES (?)
        `, [newUserId]);

        // 5. Costruisce oggetto utente da restituire
        const user = {
            id: newUserId,
            nome,
            cognome,
            email,
            ruolo: UserRole.STUDENT,
            xp_totali: 0
        };

        return user;
    },

    async login(loginData: any) {
        const { email, password } = loginData;
        const [users] = await pool.query<RowDataPacket[]>(`SELECT * FROM utenti WHERE email = ?`, [email]);
        const user = users[0];
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new Error('Credenziali non valide');
        }
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
};
