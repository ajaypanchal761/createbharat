const express = require('express');
const { protect: mentorProtect } = require('../middleware/mentorAuth');
const { saveMentorPayout, getMentorPayout } = require('../controllers/payoutController');

const router = express.Router();

router.use(mentorProtect);
router.get('/payout', getMentorPayout);
router.put('/payout', saveMentorPayout);

module.exports = router;



