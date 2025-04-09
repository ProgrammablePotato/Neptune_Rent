const multer = require('multer')
const path = require('path')
const crypto = require('crypto')
const SharpMulter  =  require("sharp-multer")

const resize = SharpMulter({
    resize: {
        height: 1080,
        fit: 'contain',
        withoutEnlargement: true
    },
    formats: {
        jpeg: { quality: 80 },
        webp: { quality: 80 },
        png: { compressionLevel: 9 }
    }
})

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../public/uploads/')
    },
    filename: (req, file, cb) => {
        const randomName = crypto.randomBytes(4).toString('hex').substring(0, 7)
        const ext = path.extname(file.originalname).toLowerCase()
        cb(null, `${randomName}${ext}`)
    }
})

const upload = multer({
    storage: storage, 
    resize: resize,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|svg|webp|jfif/
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
        const mimetype = allowedTypes.test(file.mimetype)
        if (extname && mimetype) {
            return cb(null, true)
        } else {
            return cb(new Error('Csak képfájlok engedélyezettek!'))
        }
    }
})

module.exports = upload
