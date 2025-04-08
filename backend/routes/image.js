const express = require('express')
const router = express.Router()
const upload = require('../services/image')
const path = require('path')
const fs = require('fs')
const productsService = require("../services/products")

router.post('/:id', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'Nincs fájl feltöltve.' })
    }
    res.json({ imageUrl: `${req.file.filename}` })
    console.log("IIIDÉÉÉÉ     ",req.params.id)
    productsService.patchPath(`${req.file.filename}`,req.params.id)
})

router.get('/', (req, res) => {
    const uploadsDir = path.join(__dirname, '../uploads')
    fs.readdir(uploadsDir, (err, files) => {
        if (err) {
            return res.status(500).json({ message: 'Hiba a fájlok lekérésekor.' })
        }
        const imageUrls = files.map(file => `/uploads/${file}`)
        res.json({ images: imageUrls })
    })
})

router.delete('/:filename', (req, res) => {
    const filename = req.params.filename
    const filePath = path.join(__dirname, '../uploads', filename)
    fs.unlink(filePath, err => {
        if (err) {
            return res.status(404).json({ message: 'Fájl nem található vagy nem törölhető.' })
        }
        res.json({ message: 'Kép sikeresen törölve.', deletedFile: filename })
    })
})

module.exports = router
