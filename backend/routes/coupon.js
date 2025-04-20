const express = require('express')
const router = express.Router()
const couponService = require('../services/coupon')

router.get('/', async (req, res) => {
    try {
        const coupons = await couponService.getAllCoupons()
        res.json(coupons)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.post('/', async (req, res) => {
    try {
        const { code, discount, expiryDate, isActive } = req.body
        const coupon = await couponService.createCoupon(code, discount, expiryDate, isActive)
        res.status(201).json(coupon)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { code, discount, expiryDate, isActive } = req.body
        const coupon = await couponService.updateCoupon(id, code, discount, expiryDate, isActive)
        res.json(coupon)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const coupon = await couponService.deleteCoupon(id)
        res.json(coupon)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.post('/validate', async (req, res) => {
    try {
        const { code, userId } = req.body
        const coupon = await couponService.validateCoupon(code, userId)
        res.json(coupon)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

router.post('/use', async (req, res) => {
    try {
        const { code, userId } = req.body
        const coupon = await couponService.useCoupon(code, userId)
        res.json(coupon)
    } catch (error) {
        res.status(400).json({ error: error.message })
    }
})

module.exports = router