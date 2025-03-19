const express = require('express')
const router = express.Router()
const reviewService = require('../services/review')

router.post('/:id', async (req, res) => {
    try {
        const review = await reviewService.addReview({product_id: req.body.product_id, user_id: req.params.id, rating: req.body.rating, reviewText: req.body.reviewText})
        res.json(review)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/', async (req, res) => {
    try {
        const review = await reviewService.getAllReview()
        res.json(review)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.patch('/:id', async (req, res) => {
    try {
        const review = await reviewService.editReview(req.params.id, req.body)
        res.json(review)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const review = await reviewService.deleteReview(req.params.id)
        res.json(review)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/byId/:id', async (req, res) => {
    try {
        const review = await reviewService.getReviewById(req.params.id)
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
        const review = await reviewService.getReviewByProductId(req.params.id)
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
