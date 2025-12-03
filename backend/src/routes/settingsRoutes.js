const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const { protect } = require('../middleware/protect'); // solo utenti loggati

// Applica la protezione a tutte le rotte
router.use(protect);

router.get('/', settingsController.getSettings);   // GET /api/settings
router.put('/', settingsController.updateSettings); // PUT /api/settings

module.exports = router;