const express = require('express');
const { protect: adminProtect } = require('../middleware/adminAuth');
const { listPayouts, getPayoutById } = require('../controllers/payoutController');

const router = express.Router();

router.use(adminProtect);

router.get('/payouts', listPayouts);
router.get('/payouts/:id', getPayoutById);

module.exports = router;

