const Post = require("@/db/models/post");
const mongoose = require("mongoose");
const { postSchema } = require("@/utils/validations");


// Create New Post
const newPost = async (req, res) => {
    const newPost = await Post.create({
        author: req.user.email
    });

    return res.status(200).json({
        id: newPost._id
    });
}

// Get post
const getPost = async (req, res) => {
    const id = req.params.id;

    if (!id || !mongoose.isValidObjectId(id)) {
        return res.status(404).json({
            message: "404 | POST NOT FOUND",
            details: "invalid post id found with the request"
        });
    }

    const post = await Post.findById(id);
    if (!post) {
        return res.status(404).json({
            message: "404 | POST NOT FOUND",
            details: "no post found for this id"
        });
    }

    const postData = {
        title: post.title,
        metadata: post.metadata,
        published: post.published,
        publishedAt: post.publishedAt
    };

    if (post.author === req.user.email) {
        postData.me = true;
    }

    return res.status(200).json(postData);
}

// Update post
const updatePost = async (req, res) => {
    try {
        const {
            id,
            title,
            metadata,
            published
        } = req.body;

        if (!id || !mongoose.isValidObjectId(id)) {
            return res.status(404).json({
                message: "Invalid post data",
                details: "invalid post id found with the request"
            });
        }

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({
                message: "Post not found.",
                details: "no post found for this id"
            });
        }

        await postSchema.validate({
            title,
            metadata,
            published
        }, { abortEarly: false })

        post.title = title ?? post.title;
        post.metadata = metadata ?? post.metadata;
        post.published = published ?? post.published;
        const updatedPost = await post.save();

        return res.status(200).json({
            title: updatedPost.title,
            metadata: updatedPost.metadata,
            published: updatedPost.published
        });

    } catch (error) {

        // Validation error
        if (error.name === "ValidationError") {
            console.log("Errorrrrrrr:", error)
            return res.status(400).json({
                message: error.inner[0]?.message || "Post login data is invalid.",
                details: "provided post data is invalid"
            });
        }

        throw error;
    }

}

module.exports = {
    newPost,
    getPost,
    updatePost
}