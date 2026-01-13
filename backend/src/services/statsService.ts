import { pool } from '../config/db';
import { RowDataPacket } from 'mysql2';

export const statsService = {
    async calculateStats(userId: number) {

        const [exams] = await pool.query<RowDataPacket[]>(`
            SELECT nome, voto, cfu, data, lode 
            FROM esami 
            WHERE id_utente = ? 
            ORDER BY data ASC
        `, [userId]);


        if (exams.length === 0) {
            return {
                mediaAritmetica: 0,
                mediaPonderata: 0,
                baseLaurea: 0,
                totaleCfu: 0,
                chartData: { labels: [], data: [] }
            };
        }

        let sommaVoti = 0;
        let sommaPonderata = 0;
        let totaleCfu = 0;
        
        const labels: string[] = [];
        const dataPoints: number[] = [];

        for (const exam of exams) {
            sommaVoti += exam.voto;
            sommaPonderata += (exam.voto * exam.cfu);
            totaleCfu += exam.cfu;

            labels.push(exam.nome);
            dataPoints.push(exam.voto);
        }

        const mediaAritmetica = parseFloat((sommaVoti / exams.length).toFixed(2));
        const mediaPonderata = parseFloat((sommaPonderata / totaleCfu).toFixed(2));
        const baseLaurea = parseFloat(((mediaPonderata * 110) / 30).toFixed(2));

        return {
            mediaAritmetica,
            mediaPonderata,
            baseLaurea,
            totaleCfu,
            chartData: {
                labels,
                data: dataPoints
            }
        };
    }
};
