const express = require('express');
const router = express.Router();
const CouponService = require('../services/coupons');

router.get('/used/:userId', async (req, res) => {
  try {
    const userId = parseInt(req.params.userId)
    const usedCoupons = await CouponService.getUsedCoupons(userId)
    res.json(usedCoupons)
  } catch (error) {
    console.error('Error getting used coupons:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router;