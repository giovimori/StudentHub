import { Request, Response } from 'express';
import { examService } from '../services/examService';


export const getExams = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Utente non autenticato' });

        const filters = {
            sortBy: req.query.sortBy as string,
            order: req.query.order as string,
            year: req.query.year as string
        };

        const exams = await examService.getExams(req.user.id, filters);
        res.json(exams);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Errore nel recupero esami' });
    }
};


export const addExam = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Utente non autenticato' });

        const exams = req.body;
        if (!Array.isArray(exams) || exams.length === 0) {
            return res.status(400).json({ message: 'Lista esami non valida' });
        }

        const result = await examService.addExams(req.user.id, exams);

        res.status(201).json({ 
            message: 'Esami aggiunti con successo!', 
            ids: result.ids,
            xp_totali_guadagnati: result.totalXp,
            nuovi_badge: result.newBadges 
        });

    } catch (error: any) {
        console.error(error);
        res.status(500).json({ message: error.message || 'Errore aggiunta esame' });
    }
};


export const updateExam = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Utente non autenticato' });

        const { id } = req.params;
        const result = await examService.updateExam(req.user.id, parseInt(id), req.body);

        res.json({ 
            message: 'Esame aggiornato', 
            nuovi_badge: result.newBadges,
            badge_revocati: result.revokedBadgeIds,
            xp_difference: result.xpDifference
        });

    } catch (error: any) {
        console.error(error);
        const status = error.message === 'Esame non trovato o non autorizzato' ? 404 : 500;
        res.status(status).json({ message: error.message || 'Errore aggiornamento' });
    }
};


export const deleteExam = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Utente non autenticato' });

        const { id } = req.params;
        await examService.deleteExam(req.user.id, parseInt(id));
        
        res.json({ message: 'Esame eliminato, XP ricalcolati' });

    } catch (error: any) {
        console.error(error);
        const status = error.message === 'Esame non trovato o non autorizzato' ? 404 : 500;
        res.status(status).json({ message: error.message || 'Errore eliminazione' });
    }
};