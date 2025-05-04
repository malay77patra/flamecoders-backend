const { MAX_IMG_UPLOAD_SIEZE } = require("@/config");
const { imagekit, uploadImg } = require("@/utils/imagekit");
const multer = require("multer");

const uploadImgHandler = (req, res, next) => {
    uploadImg(req, res, function (err) {
        if (err instanceof multer.MulterError) {

            if (err.code === 'LIMIT_FILE_SIZE') {
                return res.status(400).json({
                    message: "Image size must be less than 1Mb",
                    details: "image size exceeds 1b limit"
                });
            }

            return res.status(400).json({
                message: err.message || "Invalid Image data",
                details: "some error occured in multer image uploadAvt handler"
            });
        } else if (err) {
            // using next(err) lets the global handler handle the error, but it seems like multer is (err instanceof multer.MulterError)
            // returns false even in some multer errors (eg. try uloading unsupported file type)
            // It is a better idea to handle both type of errors together.
            return res.status(400).json({
                message: err.message || "Something went wrong",
                details: "some error occured in multer image uploadAvt handler"
            });
        }

        next();
    })

};

const uploadNewImage = async (req, res) => {
    if (req.file) {
        const uploadedImage = await imagekit.upload({
            file: req.file.buffer,
            fileName: req.file.originalname,
            folder: `uploads_${req.user._id}`,
        });

        return res.status(200).json({
            id: uploadedImage.fileId,
            url: uploadedImage.url
        });
    } else {
        return res.status(400).json({
            message: "No file uploaded",
            details: "no file was found with the request"
        });
    }
}

const getAllImage = async (req, res) => {
    const uploadedImages = await imagekit.listFiles({
        type: "file",
        path: `uploads_${req.user._id}`,
        sort: "DESC_CREATED"
    })
    const formattedImageUrls = uploadedImages.map(img => {
        return {
            id: img.fileId,
            url: img.url
        }
    });

    return res.status(200).json(formattedImageUrls);
}

const deleteImage = async (req, res) => {
    const { imageId } = req.params;

    if (!imageId) {
        return res.status(400).json({
            message: "Image ID is required",
            details: "Missing imageId in request params"
        });
    }

    try {
        await imagekit.deleteFile(imageId);
    } catch (error) {
        return res.status(400).json({
            message: error.message || "Something went wrong!",
            details: "error occured while deleting provided imageid"
        })
    }

    return res.status(200).json({
        id: imageId
    })

};


module.exports = {
    uploadNewImage,
    uploadImgHandler,
    getAllImage,
    deleteImage,
};