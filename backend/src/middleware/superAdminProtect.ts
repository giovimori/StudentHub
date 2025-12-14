import { Request, Response, NextFunction } from 'express';

export const superAdminProtect = (req: Request, res: Response, next: NextFunction) => {
    // req.user viene popolato dal middleware 'protect'
    // Ruolo '2' = SuperAdmin
    if (req.user && req.user.ruolo === '2') {
        next();
    } else {
        res.status(403).json({ message: 'Azione riservata al Super Amministratore' });
    }
};