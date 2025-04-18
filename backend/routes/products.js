const express = require('express')
const router = express.Router()
const productService = require('../services/products')
require('dotenv').config()

router.get('/', async (req, res) => {
    try {
        const productList = await productService.getAllProducts()
        res.json(productList)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: error.message })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const product = await productService.getProduct(req.params.id)
        res.json(product)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/', async (req, res) => {
    try {
        const product = await productService.createProduct(req.body)
        res.json(product)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.patch('/:id', async (req, res) => {
    try {
        const product = await productService.editProduct(req.params.id, req.body)
        res.json(product)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const product = await productService.deleteProduct(req.params.id)
        res.json(product)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/catimg/:category', async (req, res) => {
    try {
        const url = await productService.getLatestImage(req.params.category)
        res.json(url)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router
