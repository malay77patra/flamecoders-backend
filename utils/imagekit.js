require("dotenv").config();
const ImageKit = require('imagekit')
const multer = require('multer')
const { MAX_AVT_UPLOAD_SIEZE, MAX_IMG_UPLOAD_SIEZE, ALLOWED_IMG_TYPES } = require("@/config")


const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
})

const uploadAvt = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_AVT_UPLOAD_SIEZE },
    fileFilter: (req, file, cb) => {
        const allowed = ALLOWED_IMG_TYPES
        allowed.includes(file.mimetype)
            ? cb(null, true)
            : cb(new Error(`Only ${ALLOWED_IMG_TYPES.join(', ')} are allowed`))
    }
}).single('image')

const uploadImg = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_IMG_UPLOAD_SIEZE },
    fileFilter: (req, file, cb) => {
        const allowed = ALLOWED_IMG_TYPES
        allowed.includes(file.mimetype)
            ? cb(null, true)
            : cb(new Error(`Only ${ALLOWED_IMG_TYPES.join(', ')} are allowed`))
    }
}).single('image')


module.exports = { uploadAvt, uploadImg, imagekit };