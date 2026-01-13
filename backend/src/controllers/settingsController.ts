import { Request, Response } from 'express';
import { settingsService } from '../services/settingsService';

export const getSettings = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Non autenticato' });

        const settings = await settingsService.getSettings(req.user.id);
        res.json(settings);
    } catch (error: any) {
        console.error(error);
        const status = error.message === 'Impostazioni non trovate' ? 404 : 500;
        res.status(status).json({ message: error.message || 'Errore nel recupero impostazioni' });
    }
};

export const updateSettings = async (req: Request, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ message: 'Non autenticato' });

        const result = await settingsService.updateSettings(req.user.id, req.body);

        res.json({ 
            message: 'Impostazioni aggiornate con successo',
            settings: result
        });

    } catch (error: any) {
        console.error(error);
        const status = error.message.startsWith('Il tema') || error.message.startsWith('La soglia') || error.message.startsWith('Le soglie') ? 400 : 500;
        res.status(status).json({ message: error.message || 'Errore aggiornamento impostazioni' });
    }
};