const express = require('express')
const router = express.Router()
const { getUserDetails } = require('../services/user')
const users = require('../services/user')

router.post('getUser/:id', async (req, res) => {
    try {
        const user = await getUserDetails(req.params.id, req.body.details)
        res.json(user)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.get('/', async (req, res) => {
    try {
        const user = await users.getAllUser()
        res.json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.post('/addUser', async (req, res) => {
    try {
        const user = await users.addUser(req.body)
        res.json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.patch('/editUser/:id', async (req, res) => {
    try {
        const user = await users.editUser(req.params.id, req.body)
        res.json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.delete('/deleteUser/:id', async (req, res) => {
    try {
        const user = await users.deleteUser(req.params.id)
        res.json(user)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

module.exports = router