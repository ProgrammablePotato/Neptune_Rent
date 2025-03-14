const express = require('express')
const router = express.Router()
const products = require('../services/products')
require('dotenv').config()

router.get('/', async (req, res) => {
    try {
        const productList = await products.getAllProducts()
        res.json(productList)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: error.message })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const product = await products.getProduct(req.params.id)
        res.json(product)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/addProduct', async (req, res) => {
    try {
        const product = await products.addProduct(req.body)
        res.json(product)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.patch('/editProduct/:id', async (req, res) => {
    try {
        const product = await products.editProduct(req.params.id, req.body)
        res.json(product)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.delete('/deleteProduct/:id', async (req, res) => {
    try {
        const product = await products.deleteProduct(req.params.id)
        res.json(product)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router
