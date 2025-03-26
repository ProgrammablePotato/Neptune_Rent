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

router.get('/getBrand', async (req, res) => {
    try {
        const productList = await productService.getBrand()
        res.json(productList)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: error.message })
    }
})

router.get('/getBbC', async (req, res) => {
    try {
        const productList = await productService.getBrandByCategory(req.body.category)
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
        const product = await productService.addProduct(req.body)
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

router.delete('delProd/:id', async (req, res) => {
    try {
        const product = await productService.deleteProduct(req.params.id)
        res.json(product)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router
