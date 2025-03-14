const express = require('express')
const router = express.Router()
const reviews = require('../services/review')

router.post('/addReview/:id', async (req, res) => {
    try {
        const review = await reviews.addReview({product_id: req.body.product_id, user_id: req.params.id, rating: req.body.rating, reviewText: req.body.reviewText})
        res.json(review)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/', async (req, res) => {
    try {
        const review = await reviews.getAllReview()
        res.json(review)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.patch('/editReview/:id', async (req, res) => {
    try {
        const review = await reviews.editReview(req.params.id, req.body)
        res.json(review)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.delete('/deleteReview/:id', async (req, res) => {
    try {
        const review = await reviews.deleteReview(req.params.id)
        res.json(review)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/byId/:id', async (req, res) => {
    try {
        const review = await reviews.getReviewById(req.params.id)
        if (review.length === 0) {
            return res.json({ message: 'Nincs vélemény' })
        }
        res.json(review)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/byProdId/:id', async (req, res) => {
    try {
        const review = await reviews.getReviewByProductId(req.params.id)
        if (review.length === 0) {
            return res.json({ message: 'Nincs vélemény' })
        }
        res.json(review)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})


module.exports = router