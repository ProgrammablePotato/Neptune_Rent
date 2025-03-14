const express = require('express')
const router = express.Router()
const berles = require('../services/rent')

router.post('/addRent', async (req, res) => {
    try {
        const rent = await berles.addRent(req.body)
        res.json(rent)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/', async (req, res) => {
    try {
        const rent = await berles.getAllRent()
        res.json(rent)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.patch('/editRent/:id', async (req, res) => {
    try {
        const rent = await berles.editRent(req.params.id, req.body)
        res.json(rent)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.delete('/deleteRent/:id', async (req, res) => {
    try {
        const rent = await berles.deleteRent(req.params.id)
        res.json(rent)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/byId/:id', async (req, res) => {
    try {
        const rent = await berles.getRentById(req.params.id)
        if (rent.length === 0) {
            return res.json({ message: 'Nincs bérlés' })
        }
        res.json(rent)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/byUserId/:id', async (req, res) => {
    try {
        const rent = await berles.getRentByUserId(req.params.id)
        if (rent.length === 0) {
            return res.json({ message: 'Nincs bérlés' })
        }
        res.json(rent)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router