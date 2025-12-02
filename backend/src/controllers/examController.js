const { pool } = require('../config/db');

// GET: Ottieni tutti gli esami dello studente loggato
exports.getExams = async (req, res) => {
    try {
        // req.user.id arriva dal middleware 'protect'
        const [exams] = await pool.query(
            'SELECT * FROM esami WHERE id_utente = ? ORDER BY data DESC', 
            [req.user.id]
        );
        res.json(exams);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Errore nel recupero esami' });
    }
};

// POST: Aggiungi un nuovo esame
exports.addExam = async (req, res) => {
    const connection = await pool.getConnection(); // Usiamo una transazione
    try {
        const { nome, voto, lode, cfu, data } = req.body;
        
        // 1. Validazione base
        if (!nome || !voto || !cfu || !data) {
             return res.status(400).json({ message: 'Dati mancanti' });
        }

        // 2. Calcolo XP (Logica Gamification)
        // Formula base: Voto * CFU. Bonus 50 XP se c'è la lode.
        let xp = voto * cfu;
        if (lode) {
            xp += 50; 
        }

        await connection.beginTransaction();

        // 3. Inserisci l'esame
        const [result] = await connection.query(
            'INSERT INTO esami (id_utente, nome, voto, lode, cfu, data, xp_guadagnati) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [req.user.id, nome, voto, lode || false, cfu, data, xp]
        );

        // 4. Aggiorna XP totali utente (Il livello si aggiornerà da solo grazie alla tabella di lookup)
        await connection.query(
            'UPDATE utenti SET xp_totali = xp_totali + ? WHERE id = ?',
            [xp, req.user.id]
        );

        await connection.commit();

        res.status(201).json({ 
            message: 'Esame aggiunto con successo!', 
            id: result.insertId,
            xp_guadagnati: xp 
        });

    } catch (error) {
        await connection.rollback(); // Annulla tutto se c'è un errore
        console.error(error);
        res.status(500).json({ message: 'Errore aggiunta esame' });
    } finally {
        connection.release();
    }
};

// DELETE: Rimuovi un esame
exports.deleteExam = async (req, res) => {
    const connection = await pool.getConnection();
    try {
        const { id } = req.params;

        // 1. Recupera l'esame per sapere quanti XP togliere (e verificare che sia dell'utente)
        const [exam] = await connection.query('SELECT xp_guadagnati FROM esami WHERE id = ? AND id_utente = ?', [id, req.user.id]);
        
        if (exam.length === 0) {
            return res.status(404).json({ message: 'Esame non trovato o non autorizzato' });
        }

        const xpDaRimuovere = exam[0].xp_guadagnati;

        await connection.beginTransaction();

        // 2. Elimina esame
        await connection.query('DELETE FROM esami WHERE id = ?', [id]);

        // 3. Sottrai XP all'utente
        await connection.query(
            'UPDATE utenti SET xp_totali = xp_totali - ? WHERE id = ?',
            [xpDaRimuovere, req.user.id]
        );

        await connection.commit();
        res.json({ message: 'Esame eliminato, XP ricalcolati' });

    } catch (error) {
        await connection.rollback();
        console.error(error);
        res.status(500).json({ message: 'Errore eliminazione' });
    } finally {
        connection.release();
    }
};