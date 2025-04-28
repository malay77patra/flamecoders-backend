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
            default: {
                "type": "doc",
                "content": [
                    {
                        "type": "paragraph"
                    }
                ]
            },
        },
        preview: {
            type: String,
            default: "",
            trim: true,
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

// Updates before saving
postSchema.pre("save", function (next) {
    if (this.isModified("published") && this.published && !this.publishedAt) {
        this.publishedAt = new Date();
    }
 
    next();
});



module.exports = mongoose.model("Post", postSchema);