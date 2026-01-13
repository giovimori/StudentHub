import { Request, Response } from 'express';
import { gamificationService } from '../services/gamificationService';

export const getGamificationStatus = async (req: Request, res: Response): Promise<void> => {
    try {
        const xpTotali = req.user?.xp_totali || 0;
        const status = await gamificationService.getStatus(xpTotali);
        res.status(200).json(status);
    } catch (error) {
        console.error('Errore getGamificationStatus:', error);
        res.status(500).json({ message: 'Errore nel recupero dello stato gamification' });
    }
};

export const getMyBadges = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ message: 'Utente non autenticato' });
            return;
        }
        const badges = await gamificationService.getUserBadges(userId);
        res.status(200).json(badges);
    } catch (error) {
        console.error('Errore getMyBadges:', error);
        res.status(500).json({ message: 'Errore nel recupero dei badge utente' });
    }
};

export const getAllBadges = async (req: Request, res: Response): Promise<void> => {
    try {
        const allBadges = await gamificationService.getAllBadges();
        res.status(200).json(allBadges);
    } catch (error) {
        console.error('Errore getAllBadges:', error);
        res.status(500).json({ message: 'Errore nel recupero del catalogo badge' });
    }
};

export const syncBadges = gamificationService.syncBadges; 