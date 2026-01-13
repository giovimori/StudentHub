import { pool } from '../config/db';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { gamificationService } from './gamificationService';

export const examService = {
    async getExams(userId: number, filters: { sortBy?: string, order?: string, year?: string }) {
        const { sortBy, order, year } = filters;
        
        const validSortFields = ['data', 'voto', 'cfu', 'nome'];
        const validOrderDirs = ['ASC', 'DESC'];

        const sortField = validSortFields.includes(sortBy as string) ? sortBy : 'data';
        const orderDir = validOrderDirs.includes((order as string)?.toUpperCase()) ? (order as string).toUpperCase() : 'DESC';

        let query = 'SELECT * FROM esami WHERE id_utente = ?';
        const queryParams: any[] = [userId];

        if (year && year !== 'all') {
            query += ' AND YEAR(data) = ?';
            queryParams.push(year);
        }

        query += ` ORDER BY ${sortField} ${orderDir}`;

        const [exams] = await pool.query(query, queryParams);
        return exams;
    },

    async addExams(userId: number, exams: any[]) {
        const connection = await pool.getConnection();
        try {
            await connection.beginTransaction();

            let totalXp = 0;
            const insertedIds = [];

            for (const exam of exams) {
                const { nome, voto, lode, cfu, data } = exam;
                let xp = voto * cfu;
                if (lode) xp += 50;
                totalXp += xp;

                const [result] = await connection.query<ResultSetHeader>(
                    'INSERT INTO esami (id_utente, nome, voto, lode, cfu, data, xp_guadagnati) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    [userId, nome, voto, lode || false, cfu, data, xp]
                );
                insertedIds.push(result.insertId);
            }

            await connection.query(
                'UPDATE utenti SET xp_totali = xp_totali + ? WHERE id = ?',
                [totalXp, userId]
            );

            // Sincronizza badge dopo inserimento
            const { newBadges } = await gamificationService.syncBadges(userId, connection);

            await connection.commit();
            return { ids: insertedIds, totalXp, newBadges };

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    async updateExam(userId: number, examId: number, examData: any) {
        const connection = await pool.getConnection();
        try {
            const { nome, voto, lode, cfu, data } = examData;

            // Recupera vecchio esame per calcolo differenziale XP
            const [oldExams] = await connection.query<RowDataPacket[]>('SELECT * FROM esami WHERE id = ? AND id_utente = ?', [examId, userId]);
            if (oldExams.length === 0) throw new Error('Esame non trovato o non autorizzato');
            
            const oldExam = oldExams[0];
            const oldXp = oldExam.xp_guadagnati;

            // Calcola nuovo XP e differenza
            let newXp = voto * cfu;
            if (lode) newXp += 50;
            const xpDifference = newXp - oldXp;

            await connection.beginTransaction();

            await connection.query(
                'UPDATE esami SET nome = ?, voto = ?, lode = ?, cfu = ?, data = ?, xp_guadagnati = ? WHERE id = ?',
                [nome, voto, lode || false, cfu, data, newXp, examId]
            );

            if (xpDifference !== 0) {
                await connection.query(
                    'UPDATE utenti SET xp_totali = xp_totali + ? WHERE id = ?',
                    [xpDifference, userId]
                );
            }

            // Ricalcolo badge post-aggiornamento
            const { newBadges, revokedBadgeIds } = await gamificationService.syncBadges(userId, connection);

            await connection.commit();
            return { newBadges, revokedBadgeIds, xpDifference };

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    },

    async deleteExam(userId: number, examId: number) {
        const connection = await pool.getConnection();
        try {
            const [exam] = await connection.query<RowDataPacket[]>('SELECT xp_guadagnati FROM esami WHERE id = ? AND id_utente = ?', [examId, userId]);
            if (exam.length === 0) throw new Error('Esame non trovato o non autorizzato');

            const xpDaRimuovere = exam[0].xp_guadagnati;

            await connection.beginTransaction();
            await connection.query('DELETE FROM esami WHERE id = ?', [examId]);
            await connection.query('UPDATE utenti SET xp_totali = xp_totali - ? WHERE id = ?', [xpDaRimuovere, userId]);
            
            await gamificationService.syncBadges(userId, connection);
            
            await connection.commit();
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }
    }
};
