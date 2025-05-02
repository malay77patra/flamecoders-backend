const User = require("@/db/models/user");
const { updateSchema } = require("@/utils/validations");
const { imagekit, upload } = require("@/utils/imagekit");
const { getUserAvatarFilename } = require("@/utils/helpers");
const sharp = require('sharp');
const multer = require('multer');

const uploadImage = (req, res, next) => {
    upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({
                message: err.message || "Invalid Image data",
                details: "some error occured in multer image upload handler"
            });
        } else if (err) {
            // using next(err) lets the global handler handle the error, but it seems like multer is (err instanceof multer.MulterError)
            // returns false even in some multer errors (eg. try uloading unsupported file type)
            // It is a better idea to handle both type of errors together.
            return res.status(400).json({
                message: err.message || "Something went wrong",
                details: "some error occured in multer image upload handler"
            });
        }

        next();
    })

};

const updateUser = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        const { name } = req.body || {};
        const updatedProps = {};

        if (name) {
            await updateSchema.validate({ name }, { abortEarly: false });
            user.name = name;
            updatedProps.name = name;
        }

        if (req.file) {
            let imageBuffer = req.file.buffer;
            const metadata = await sharp(imageBuffer).metadata();

            if (metadata.width !== metadata.height) {
                const size = Math.min(metadata.width, metadata.height);
                imageBuffer = await sharp(imageBuffer)
                    .png()
                    .resize({
                        width: size,
                        height: size,
                        fit: sharp.fit.cover,
                        position: 'center'
                    })
                    .toBuffer();
            }

            const uploadedImage = await imagekit.upload({
                file: imageBuffer,
                fileName: getUserAvatarFilename(req.user._id, "png"),
                folder: "avatars",
                useUniqueFileName: false,
            });
            const avatarUrl = uploadedImage.url + '?updatedAt=' + Date.now();
            user.avatar = avatarUrl;
            updatedProps.avatar = avatarUrl;
        }

        await user.save();

        return res.status(200).json(updatedProps);
    } catch (error) {

        // Validation error
        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: error.inner[0]?.message || "Update data is invalid.",
                details: "provided update data is invalid"
            });
        }

        throw error;
    }
}

module.exports = {
    updateUser,
    uploadImage,
}