export interface Exam {
    data: Date | string;
    lode: boolean | number;
    cfu: number;
}

interface BadgeRule {
    id: number;
    description: string; // Utile per debug/documentazione
    check: (exams: Exam[]) => boolean;
}

export const BADGE_RULES: BadgeRule[] = [
    { 
        id: 1, 
        description: "Primo esame superato",
        check: (exams) => exams.length >= 1 
    },
    { 
        id: 2, 
        description: "Almeno un esame con lode",
        check: (exams) => exams.some(e => e.lode === 1 || e.lode === true) 
    },
    { 
        id: 3, 
        description: "Stacanovista (3 esami in un mese)",
        check: (exams) => {
            const byMonth: { [key: string]: number } = {};
            for (const e of exams) {
                const d = new Date(e.data);
                const key = `${d.getFullYear()}-${d.getMonth()}`;
                byMonth[key] = (byMonth[key] || 0) + 1;
                if (byMonth[key] >= 3) return true;
            }
            return false;
        }
    },
    { 
        id: 4, 
        description: "Studente Modello (>= 90 CFU)",
        check: (exams) => exams.reduce((total, e) => total + e.cfu, 0) >= 90 
    }
];
