const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const { protect } = require('../middleware/protect');

// Applico la protezione a TUTTE le rotte di questo file
// Se i cookie non sono validi, non passa oltre questa riga.
router.use(protect);

router.get('/', examController.getExams);         // GET /api/exams
router.post('/', examController.addExam);         // POST /api/exams
router.delete('/:id', examController.deleteExam); // DELETE /api/exams/123

module.exports = router;