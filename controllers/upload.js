const { upload, imagekit } = require("@utils/imagekit")


const uploadEditorImage = (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            const message = err.code === 'LIMIT_FILE_SIZE'
                ? 'File too large. Max 5MB.'
                : err.message || 'Upload error.'

            const details = err.code === 'LIMIT_FILE_SIZE'
                ? 'uploaded image size is greater than 5mb'
                : 'unknown error while uploading image'

            return res.status(400).json({
                message,
                details
            })
        }

        if (!req.file) {
            return res.status(400).json({
                message: 'No file uploaded',
                details: 'file not found in request'
            })
        }

        const uploadResponse = await imagekit.upload({
            file: req.file.buffer,
            fileName: req.file.originalname,
            folder: 'editorjs',
            useUniqueFileName: true
        })

        return res.json({
            file: { url: uploadResponse.url }
        })
    })
}

module.exports = { uploadEditorImage }
