const express = require('express');
const enrollmentController = require('../controllers/enrollmentController');
const router = express.Router();

router.post('/enroll', enrollmentController.enrollParticipant);
router.post('/shift-batch/', enrollmentController.shiftBatch);
router.post('/make-payment/', enrollmentController.makeMonthlyPayment);

module.exports = router;