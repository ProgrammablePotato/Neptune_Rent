const express = require('express')
const router = express.Router()
const buyService = require('../services/buy')

router.post("/", async (req, res) => {
    try {
        const { user_id, details } = req.body;
        if (!user_id || !Array.isArray(details)) {
            return res.status(400).json({ error: "Hiányzó vagy hibás adatok!" })
        }
        const response = await buyService.buyProduct(details, user_id)
        res.json(response)
    } catch (error) {
        res.status(500).json({ error: error.message })
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

router.patch('/:id', async (req, res) => {
    try {
        const result = await buyService.editBuy(req.params.id, req.body)
        res.json(result)
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: error.message })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const result = await buyService.getBuyDetails(req.params.id)
        res.json(result)
    } catch (error) {
        console.error(error)
        res.status(500).json({ success: false, message: error.message })
    }
})

router.delete("delBuy/:id", async (req, res) => {
    try {
        const { id } = req.params
        const response = await buyService.deleteBuy(id)
        res.json(response)
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router