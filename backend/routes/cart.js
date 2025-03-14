const express = require('express')
const router = express.Router()
const kosar = require('../services/cart')

router.get('/byName/:name', async (req, res) => {
    try {
        const cart = await kosar.getUserCartByName(req.params.name)
        if (cart.length === 0) {
            return res.json({ message: 'Nincs termék a felhasználó kosarában' })
        }
        res.json(cart)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/', async (req, res) => {
    try {
        const cart = await kosar.getAllCart()
        res.json(cart)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/byId/:id', async (req, res) => {
    try {
        const cart = await kosar.getUserCartById(req.params.id)
        if (cart.length === 0) {
            return res.json({ message: 'Nincs termék a felhasználó kosarában' })
        }
        res.json(cart)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/addToCart/:id', async (req, res) => {
    try {
        const cart = await kosar.addToUserCart(req.params.id, req.body.contents)
        res.json(cart)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.patch('/updateCart/:id', async (req, res) => {
    try {
        const cart = await kosar.updateUserCart(req.params.id, req.body.contents)
        res.json(cart)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router
