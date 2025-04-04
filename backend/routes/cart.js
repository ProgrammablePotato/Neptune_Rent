const express = require('express')
const router = express.Router()
const cartService = require('../services/cart')

router.get('/:name', async (req, res) => {
    try {
        const cart = await cartService.getUserCartByName(req.params.name)
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
        const cart = await cartService.getAllCart()
        res.json(cart)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/byId/:id', async (req, res) => {
    try {
        const cart = await cartService.getUserCartById(req.params.id)
        if (cart.length === 0) {
            return res.json({ message: 'Nincs termék a felhasználó kosarában' })
        }
        res.json(cart)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// router.post('/:id', async (req, res) => {
//     try {
//         const cart = await cartService.addToUserCart(req.params.id, req.body.contents)
//         res.json(cart)
//     } catch (error) {
//         res.status(500).json({ message: error.message })
//     }
// })

router.patch('/:id', async (req, res) => {
    try {
        const cart = await cartService.updateUserCart(req.params.id, req.body.contents)
        res.json(cart)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const cart = await cartService.deleteUserCart(req.params.id)
        res.json(cart)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// router.get('/test/:id', async (req, res) => {
//     try {
//         const cart = await cartService.getTestCart(req.params.id)
//         if (cart.length === 0) {
//             return res.json({ message: 'Nincs termék a felhasználó kosarában' })
//         }
//         res.json(cart)
//     }
//     catch (error) {
//         res.status(500).json({ message: error.message })
//     }
// })

router.post('/:id', async (req, res) => {
    try {
        const cart = await cartService.addToTestCart(req.params.id, req.body.product_id)
        res.json(cart)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router
