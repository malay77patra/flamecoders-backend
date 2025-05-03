const Post = require("@/db/models/post");
const mongoose = require("mongoose");
const { postSchema } = require("@/utils/validations");

// Create New Post
const newPost = async (req, res) => {
    const newPost = await Post.create({
        author: req.user._id
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

    const post = await Post.findById(id)
        .populate('author', 'name avatar');
    if (!post) {
        return res.status(404).json({
            message: "404 | POST NOT FOUND",
            details: "no post found for this id"
        });
    }

    const isAuthor = post.author.equals(req.user._id);
    const isLiked = post.likes.some(likeId => likeId.equals(req.user._id));

    if (post.published || isAuthor) {
        const postData = {
            title: post.title,
            metadata: post.metadata,
            published: post.published,
            liked: isLiked,
            likeCount: post.likes.length,
            author: post.author,
            publishedAt: post.publishedAt
        };

        return res.status(200).json(postData);
    } else {
        return res.status(404).json({
            message: "404 | POST NOT FOUND",
            details: "no post found for this id"
        });
    }
};

const togglePostLike = async (req, res) => {
    const { id } = req.body;
    const userId = req.user._id;

    if (!id || !mongoose.isValidObjectId(id)) {
        return res.status(404).json({
            message: "Invalid post data",
            details: "Invalid post ID provided"
        });
    }

    const post = await Post.findById(id);
    if (!post) {
        return res.status(404).json({
            message: "Post not found.",
            details: "No post found for this ID"
        });
    }

    const alreadyLiked = post.likes.some(likeId => likeId.equals(userId));

    if (alreadyLiked) {
        post.likes = post.likes.filter(likeId => !likeId.equals(userId));
    } else {
        post.likes.push(userId);
    }

    await post.save();

    return res.status(200).json({
        liked: !alreadyLiked,
        likeCount: post.likes.length
    });
}

// Get My Posts
const getMyPosts = async (req, res) => {
    res.set('Cache-Control', 'no-store');

    const posts = await Post.find({ author: req.user._id });

    const formattedPost = [];

    posts.forEach((post) => {
        formattedPost.push({
            id: post._id,
            title: post.title,
            published: post.published
        })
    });

    return res.status(200).json(formattedPost);
}

// Get all Posts
const getAllPosts = async (req, res) => {
    res.set('Cache-Control', 'no-store');

    const posts = await Post.find({ published: true })
        .populate('author', 'name avatar');

    const formattedPost = [];

    posts.forEach((post) => {
        formattedPost.push({
            id: post._id,
            title: post.title,
            timestamp: post.publishedAt,
            author: post.author,
            likeCount: post.likes.length,
        })
    });

    return res.status(200).json(formattedPost);
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

        if (!post.author.equals(req.user._id)) {
            return res.status(403).json({
                message: "Forbidden action.",
                details: "user is not the author of requested post update"
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

        if (post.published && !post.title) {
            return res.status(400).send({
                message: "Title is required for public post.",
                details: "post with empty title can not be published"
            });
        } else {
            const updatedPost = await post.save();

            return res.status(200).json({
                title: updatedPost.title,
                metadata: updatedPost.metadata,
                published: updatedPost.published,
                publishedAt: updatedPost.publishedAt
            });
        }

    } catch (error) {

        // Validation error
        if (error.name === "ValidationError") {
            return res.status(400).json({
                message: error.inner[0]?.message || "Post login data is invalid.",
                details: "provided post data is invalid"
            });
        }

        throw error;
    }

}

// Delete post
const deletePost = async (req, res) => {
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
            message: "Post not found.",
            details: "no post found for this id"
        });
    }

    if (!post.author.equals(req.user._id)) {
        return res.status(403).json({
            message: "Forbidden action.",
            details: "user is not the author of requested post update"
        });
    }

    const deletedPost = await Post.findByIdAndDelete(id);
    return res.status(200).json(deletedPost);
}

module.exports = {
    newPost,
    getPost,
    updatePost,
    deletePost,
    getMyPosts,
    getAllPosts,
    togglePostLike,
}