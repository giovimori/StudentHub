import { RowDataPacket } from 'mysql2';

export interface GlobalRank extends RowDataPacket {
    id: number;
    nome: string;
    cognome: string;
    xp_totali: number;
    ruolo: '0' | '1' | '2';
    rank: number;
}
