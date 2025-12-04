import express from 'express';
import * as userController from '../controllers/userController';
import { protect } from '../middleware/protect';

const router = express.Router();

// Applica la protezione a tutte le rotte: 
// solo utenti loggati possono vedere/modificare i propri settings
router.use(protect);

router.get('/leaderboard', userController.getLeaderboard); // GET /api/users/leaderboard

export default router;