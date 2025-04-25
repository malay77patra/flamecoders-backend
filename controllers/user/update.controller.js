const User = require("@/db/models/user");
const { updateSchema } = require("@/utils/validations");

const updateUser = async (req, res) => {
    try {
        const { name } = req.body;
        await updateSchema.validate({ name }, { abortEarly: false })

        const user = await User.findOne({ email: req.user.email });
        user.name = name;
        const updatedUser = await user.save();

        return res.status(200).json({
            user: {
                name: updatedUser.name
            }
        });

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
    updateUser
}