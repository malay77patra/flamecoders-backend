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
        likes: {
            type: [Schema.Types.ObjectId],
            ref: "User",
            default: [],
        },
        published: {
            type: Boolean,
            default: false,
        },
        publishedAt: {
            type: Date,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'

        },
    },
    {
        timestamps: true,
    }
);

// Updates before saving
postSchema.pre("save", function (next) {
    if (this.isModified("published") && this.published) {
        console.log("publishing a post")
        this.publishedAt = new Date();
    }

    next();
});



module.exports = mongoose.model("Post", postSchema);