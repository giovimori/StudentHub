import { Request, Response } from 'express';
import { sendTokenResponse } from '../utils/jwt';
import { authService } from '../services/authService';

export const register = async (req: Request, res: Response) => {
    try {
        const { nome, cognome, email, password } = req.body;

        if (!nome || !cognome || !email || !password) {
            return res.status(400).json({ message: 'Tutti i campi sono obbligatori' });
        }

        const user = await authService.register({ nome, cognome, email, password });
        sendTokenResponse(user, 201, res);

    } catch (error: any) {
        console.error('Errore register:', error);
        if (error.message === 'Email già registrata') {
            return res.status(409).json({ message: error.message });
        }
        res.status(500).json({ message: 'Errore del server' });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Inserisci email e password' });
        }

        const user = await authService.login({ email, password });
        sendTokenResponse(user, 200, res);

    } catch (error: any) {
        console.error('Errore login:', error);
        if (error.message === 'Credenziali non valide') {
            return res.status(401).json({ message: error.message });
        }
        res.status(500).json({ message: 'Errore del server' });
    }
};

export const logout = (req: Request, res: Response) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ success: true, message: 'Logout effettuato' });
};