const express = require('express')
const router = express.Router()
const image = require('../services/image')

router.get('/', async (req, res) => {
    try {
        const imageUrl = await image.getImage(req.body.product)
        res.json(imageUrl)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router