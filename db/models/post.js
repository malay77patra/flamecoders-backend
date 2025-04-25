const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema(
    {
        title: {
            type: String,
            default: "",
            trim: true,
        },
        metadata: {
            type: Schema.Types.Mixed,
            default: {},
        },
        published: {
            type: Boolean,
            default: false,
        },
        publishedAt: {
            type: Date,
        },
        author: {
            type: String,
            required: true,
            trim: true,
            lowercase: true,
        },
    },
    {
        timestamps: true,
    }
);

// Update publishedAt when published
postSchema.pre("save", function (next) {
    if (this.isModified("published") && this.published && !this.publishedAt) {
        this.publishedAt = new Date();
    }
    next();
});



module.exports = mongoose.model("Post", postSchema);