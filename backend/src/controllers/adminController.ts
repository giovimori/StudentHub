import { Request, Response } from 'express';
import { pool } from '../config/db';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import bcrypt from 'bcrypt';



// --- GET: FUNZIONALITÀ DI LETTURA (Admin) ---

// Lista utenti
export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const query = `
            SELECT id, nome, cognome, email, ruolo, xp_totali, created_at 
            FROM utenti 
            ORDER BY created_at DESC
        `;
        const [users] = await pool.query<RowDataPacket[]>(query);
        res.status(200).json(users);
    } catch (error) {
        console.error('Errore getAllUsers:', error);
        res.status(500).json({ message: 'Errore nel recupero della lista utenti' });
    }
};

// Statistiche amministrative
export const getAdminStats = async (req: Request, res: Response): Promise<void> => {
    try {
        const query = `
            SELECT COUNT(e.id) AS total_exams 
            FROM esami e
            JOIN utenti u ON e.id_utente = u.id
            WHERE u.ruolo = '0'
        `;
        
        const [result] = await pool.query<RowDataPacket[]>(query);
        res.status(200).json({
            message: 'Statistiche amministrative',
            exams_by_standard_users: result[0].total_exams
        });

    } catch (error) {
        console.error('Errore getAdminStats:', error);
        res.status(500).json({ message: 'Errore nel recupero delle statistiche' });
    }
};

// Classifica globale
export const getGlobalRanking = async (req: Request, res: Response): Promise<void> => {
    try {
        const query = `
            SELECT 
                nome,
                xp_totali
            FROM utenti
            ORDER BY xp_totali DESC
            LIMIT 100
        `;
        
        const [users] = await pool.query<RowDataPacket[]>(query);

        const ranking = users.map((user, index) => ({
            ...user,
            rank: index + 1
        }));

        res.status(200).json(ranking);

    } catch (error) {
        console.error('Errore getGlobalRanking:', error);
        res.status(500).json({ message: 'Errore nel recupero della classifica globale' });
    }
};


// --- WRITE: FUNZIONALITÀ CRITICHE (Solo SuperAdmin) ---

// Aggiorna il ruolo di un utente
export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const { nuovo_ruolo } = req.body;

    const validRoles = ['0', '1', '2'];
    if (!validRoles.includes(nuovo_ruolo)) {
        res.status(400).json({ message: 'Ruolo non valido. Ruoli permessi: 0, 1, 2' });
        return;
    }

    try {
        const currentUserId = (req as any).user.id;
        // Impedisce al SuperAdmin di declassarsi da solo per errore
        if (parseInt(id) === currentUserId && nuovo_ruolo !== '2') {
             res.status(400).json({ message: 'Non puoi rimuovere il tuo stesso ruolo di SuperAdmin.' });
             return;
        }

        const query = 'UPDATE utenti SET ruolo = ? WHERE id = ?';
        const [result] = await pool.query<ResultSetHeader>(query, [nuovo_ruolo, id]);

        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Utente non trovato' });
            return;
        }

        res.status(200).json({ 
            message: 'Ruolo aggiornato con successo',
            userId: id,
            newRole: nuovo_ruolo
        });

    } catch (error) {
        console.error('Errore updateUserRole:', error);
        res.status(500).json({ message: 'Errore nell\'aggiornamento del ruolo' });
    }
};

// Elimina account Admin
export const deleteAdminAccount = async (req: Request, res: Response): Promise<void> => {
    const userIdToDelete = req.params.id;

    try {
        // Verifica ruolo utente target
        const [users] = await pool.query<RowDataPacket[]>('SELECT ruolo FROM utenti WHERE id = ?', [userIdToDelete]);
        
        if (users.length === 0) {
            res.status(404).json({ message: 'Utente non trovato.' });
            return;
        }

        const roleToDelete = users[0].ruolo;
        const currentUserId = (req as any).user.id;

        // Controlli di sicurezza
        if (roleToDelete !== '1') {
            res.status(400).json({ message: 'Questa azione è permessa solo per eliminare account Admin (ruolo 1).' });  
            return;
        }
        
        if (parseInt(userIdToDelete) === currentUserId) {
            res.status(400).json({ message: 'Non puoi eliminare il tuo stesso account.' });
            return;
        }

        // Eliminazione
        const [result] = await pool.query<ResultSetHeader>('DELETE FROM utenti WHERE id = ?', [userIdToDelete]);

        res.status(200).json({ message: 'Account Admin eliminato con successo.' });

    } catch (error) {
        console.error('Errore deleteAdminAccount:', error);
        res.status(500).json({ message: 'Errore nell\'eliminazione dell\'account.' });
    }
};

// Registra un nuovo account Admin
export const registerAdmin = async (req: Request, res: Response): Promise<void> => {
    const { nome, cognome, email, password } = req.body;

    if (!nome || !cognome || !email || !password) {
        res.status(400).json({ message: 'Tutti i campi sono obbligatori.' });
        return;
    }

    try {
        // Check esistenza email
        const [existing] = await pool.query<RowDataPacket[]>('SELECT id FROM utenti WHERE email = ?', [email]);
        if (existing.length > 0) {
            res.status(400).json({ message: 'Email già registrata.' });
            return;
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Insert con ruolo forzato a '1' (Admin)
        const insertQuery = `
            INSERT INTO utenti (nome, cognome, email, password, ruolo) 
            VALUES (?, ?, ?, ?, '1')
        `;
        const [result] = await pool.query<ResultSetHeader>(insertQuery, [nome, cognome, email, hashedPassword]);
        
        res.status(201).json({ 
            message: 'Nuovo Admin creato con successo.',
            id: result.insertId,
            email
        });

    } catch (error) {
        console.error('Errore registerAdmin:', error);
        res.status(500).json({ message: 'Errore server durante la creazione Admin.' });
    }
};