const express = require('express');
const router = express.Router();
const examController = require('../controllers/examController');
const { protect } = require('../middleware/protect');

// Applica la protezione a tutte le rotte
router.use(protect);

router.get('/', examController.getExams);         // GET /api/exams
router.post('/', examController.addExam);         // POST /api/exams
router.delete('/:id', examController.deleteExam); // DELETE /api/exams/123

module.exports = router;