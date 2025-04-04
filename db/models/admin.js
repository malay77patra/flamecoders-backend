const mongoose = require("mongoose");
const { Schema } = mongoose;

const adminSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    }
});

module.exports = mongoose.model("Admin", adminSchema);