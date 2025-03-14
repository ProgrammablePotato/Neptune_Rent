const express = require('express')
const router = express.Router()
const buyService = require('../services/buy')

router.post('/buy', async (req, res) => {
    try {
        const result = await buyService.buyProduct(req.body)
        res.json(result)
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: error.message })
    }
})

router.get('/', async (req, res) => {
    try {
        const result = await buyService.getAllBuyers()
        res.json(result)
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: error.message })
    }
})

router.patch('/buy/:id', async (req, res) => {
    try {
        const result = await buyService.editBuy(req.params.id, req.body)
        res.json(result)
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: error.message })
    }
})

router.get('/buy/:id', async (req, res) => {
    try {
        const result = await buyService.getBuyDetails(req.params.id)
        res.json(result)
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: error.message })
    }
})

router.delete('/buy/:id', async (req, res) => {
    try {
        const result = await buyService.deleteBuy(req.params.id)
        res.json(result)
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: error.message })
    }
})


module.exports = router