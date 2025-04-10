const mongoose = require("mongoose");
const { Schema } = mongoose;

const postSchema = new Schema(
    {
        title: {
            type: String,
            trim: true,
            maxlength: 70,
            default: ""
        },
        metadata: {
            type: Schema.Types.Mixed,
            required: true,
            default: {}
        },
        likes: {
            type: Number,
            default: 0,
            min: 0
        },
        published: {
            type: Boolean,
            default: false
        },
        publishedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

postSchema.pre("save", function (next) {
    if (this.isModified("published")) {
        if (this.published === true) {
            this.publishedAt = new Date();
        } else {
            this.publishedAt = null;
        }
    }
    next();
});

module.exports = mongoose.model("Post", postSchema);
