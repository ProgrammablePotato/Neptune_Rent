const express = require('express')
const router = express.Router()
const rentService = require('../services/rent')

router.post('/', async (req, res) => {
    try {
        const rent = await rentService.addRent(req.body)
        res.json(rent)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/', async (req, res) => {
    try {
        const rent = await rentService.getAllRent()
        res.json(rent)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.patch('/:id', async (req, res) => {
    try {
        const rent = await rentService.editRent(req.params.id, req.body)
        res.json(rent)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const rent = await rentService.deleteRent(req.params.id)
        res.json(rent)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/byId/:id', async (req, res) => {
    try {
        const rent = await rentService.getRentById(req.params.id)
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

router.get("/notify", async (req, res) => {
    try {
        await berles.notifyUser();
        res.json({ success: true, message: "Értesítések elküldve." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router
