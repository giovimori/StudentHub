import { UserRole } from './enums';

export interface User {
    id: number;
    nome: string;
    cognome: string;
    email: string;
    ruolo: UserRole;
    xp_totali: number;
}
