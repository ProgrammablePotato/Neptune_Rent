const multer = require('multer')
const path = require('path')
const crypto = require('crypto')

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/')
    },
    filename: (req, file, cb) => {
        const randomName = crypto.randomBytes(4).toString('hex').substring(0, 7)
        const ext = path.extname(file.originalname).toLowerCase()
        cb(null, `${randomName}${ext}`)
    }
})

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|svg|webp/
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
