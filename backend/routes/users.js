const express = require('express')
const router = express.Router()

const userService = require('../services/user')

router.post('/:id', async (req, res) => {
    try {
        const user = await userService.getUserDetails(req.params.id, req.body.details)
        res.json(user)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/', async (req, res) => {
    try {
        const user = await userService.getAllUser()
        res.json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/', async (req, res) => {
    try {
        const user = await userService.addUser(req.body)
        res.json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.patch('/:id', async (req, res) => {
    try {
        const user = await userService.editUser(req.params.id, req.body)
        res.json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const user = await userService.deleteUser(req.params.id)
        res.json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router
