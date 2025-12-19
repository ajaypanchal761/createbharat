const express = require('express');
const { protect: caProtect } = require('../middleware/caAuth');
const { saveCAPayout, getCAPayout } = require('../controllers/payoutController');

const router = express.Router();

router.use(caProtect);
router.get('/payout', getCAPayout);
router.put('/payout', saveCAPayout);

module.exports = router;



