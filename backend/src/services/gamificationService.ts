import { pool } from '../config/db';
import { RowDataPacket } from 'mysql2';
import { Livello, ObiettivoSbloccato } from '../types/gamification';
import { BADGE_RULES, Exam } from '../config/gamificationRules';

export const gamificationService = {

    async getStatus(xpTotali: number) {
        const query = `
            SELECT numero, nome, xp_min, xp_max 
            FROM livelli 
            WHERE xp_min <= ? AND (xp_max IS NULL OR xp_max > ?)
            ORDER BY numero DESC LIMIT 1
        `;
        const [livelli] = await pool.query<Livello[]>(query, [xpTotali, xpTotali]);
        
        let livelloCorrente = livelli[0];
        if (!livelloCorrente) {
             livelloCorrente = { numero: 0, nome: 'Non Classificato', xp_min: 0, xp_max: 100 } as Livello;
        }

        let progressPercent = 100;
        if (livelloCorrente.xp_max !== null) {
            const xpBase = livelloCorrente.xp_min;
            const xpNext = livelloCorrente.xp_max;
            const totalRange = xpNext - xpBase;
            const userProgress = xpTotali - xpBase;
            progressPercent = totalRange > 0 ? Math.round((userProgress / totalRange) * 100) : 100;
        }

        return {
            xp_totali: xpTotali,
            livello: { numero: livelloCorrente.numero, nome: livelloCorrente.nome },
            progress: {
                percentuale: progressPercent,
                xp_mancanti: livelloCorrente.xp_max ? (livelloCorrente.xp_max - xpTotali) : 0,
                prossima_soglia: livelloCorrente.xp_max
            }
        };
    },


    async getUserBadges(userId: number) {
        const query = `
            SELECT ob.id AS id_obiettivo, ob.nome, ob.descrizione, ob.xp_valore, os.data_conseguimento
            FROM obiettivi_sbloccati os
            JOIN obiettivi ob ON os.id_obiettivo = ob.id
            WHERE os.id_utente = ?
            ORDER BY os.data_conseguimento DESC
        `;
        const [badges] = await pool.query<ObiettivoSbloccato[]>(query, [userId]);
        return badges;
    },


    async getAllBadges() {
        const [allBadges] = await pool.query('SELECT id, nome, descrizione, xp_valore FROM obiettivi ORDER BY xp_valore ASC');
        return allBadges;
    },

    async syncBadges(userId: number, connection: any): Promise<{ newBadges: ObiettivoSbloccato[], revokedBadgeIds: number[] }> {
        const newBadges: ObiettivoSbloccato[] = [];
        const revokedBadgeIds: number[] = [];


        const [exams] = await connection.query('SELECT * FROM esami WHERE id_utente = ? ORDER BY data ASC', [userId]);


        const [existing] = await connection.query('SELECT id_obiettivo FROM obiettivi_sbloccati WHERE id_utente = ?', [userId]);
        const existingIds = new Set<number>(existing.map((r: any) => r.id_obiettivo));

        // Itera sulle regole importate
        for (const rule of BADGE_RULES) {
            // Casting esplicito o adattamento dei dati se necessario, ma qui l'interfaccia Exam corrisponde a quanto atteso
            const isMet = rule.check(exams as Exam[]);
            const hasBadge = existingIds.has(rule.id);

            if (isMet && !hasBadge) {
                await this.assignBadge(userId, rule.id, connection, newBadges);
            } else if (!isMet && hasBadge) {
                await this.revokeBadge(userId, rule.id, connection, revokedBadgeIds);
            }
        }

        return { newBadges, revokedBadgeIds };
    },


    async assignBadge(userId: number, badgeId: number, connection: any, list: ObiettivoSbloccato[]) {
        const [rows] = await connection.query('SELECT * FROM obiettivi WHERE id = ?', [badgeId]);
        if (!rows.length) return;
        const badge = rows[0];

        await connection.query('INSERT INTO obiettivi_sbloccati (id_utente, id_obiettivo, data_conseguimento) VALUES (?, ?, NOW())', [userId, badgeId]);
        await connection.query('UPDATE utenti SET xp_totali = xp_totali + ? WHERE id = ?', [badge.xp_valore, userId]);

        list.push({
            id_obiettivo: badge.id,
            nome: badge.nome,
            descrizione: badge.descrizione,
            xp_valore: badge.xp_valore,
            data_conseguimento: new Date()
        } as ObiettivoSbloccato);
    },


    async revokeBadge(userId: number, badgeId: number, connection: any, list: number[]) {
        const [rows] = await connection.query('SELECT xp_valore FROM obiettivi WHERE id = ?', [badgeId]);
        if (!rows.length) return;
        const xp = rows[0].xp_valore;

        await connection.query('DELETE FROM obiettivi_sbloccati WHERE id_utente = ? AND id_obiettivo = ?', [userId, badgeId]);
        await connection.query('UPDATE utenti SET xp_totali = GREATEST(0, xp_totali - ?) WHERE id = ?', [xp, userId]);
        
        list.push(badgeId);
    }
};
