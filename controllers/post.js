const Post = require("@models/post");


const getPost = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            message: "Invalid post link",
            details: "no post id is provided with the request"
        });
    }

    const post = await Post.findOne({ _id: id, published: true });

    if (!post) {
        return res.status(404).json({
            message: "Post not found",
            details: "no published post found with the given id"
        });
    }

    return res.status(200).json({
        message: "Post fetched successfully",
        metadata: post.metadata
    });
};




// ------------------IMPORTANT------------------
//
// Checking for admin credentials are expected to be handled
// by middlewares

// New post

const createNewPostAdmin = async (req, res) => {

    const newPost = await Post.create({});

    return res.status(201).json({
        message: "Post created.",
        id: newPost._id,
    });
}

const getPostAdmin = async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({
            message: "Invalid post link",
            details: "no post id is provided with the request"
        });
    }

    const post = await Post.findOne({ _id: id });

    if (!post) {
        return res.status(404).json({
            message: "Post not found",
            details: "no post found with the given id"
        });
    }

    return res.status(200).json({
        message: "Post fetched successfully",
        metadata: post.metadata,
        published: post.published
    });
};

const publishPostAdmin = async (req, res) => {
    const { id, published } = req.body;

    if (!id) {
        return res.status(400).json({
            message: "Invalid post link",
            details: "no post id is provided with the request"
        });
    }

    const post = await Post.findOne({ _id: id });

    if (!post) {
        return res.status(404).json({
            message: "Post not found",
            details: "no post found with the given id"
        });
    }

    post.published = published;
    await post.save();

    return res.status(200).json({
        message: post.published ? "Post published" : "Post unpublished",
        metadata: post.metadata,
        published: post.published,
    });
}

const updatePostAdmin = async (req, res) => {
    const { id, metadata } = req.body;

    if (!id) {
        return res.status(400).json({
            message: "Invalid post link",
            details: "no post id is provided with the request"
        });
    }

    const post = await Post.findOne({ _id: id });

    if (!post) {
        return res.status(404).json({
            message: "Post not found",
            details: "no post found with the given id"
        });
    }

    post.metadata = metadata;
    await post.save();

    res.status(200).json({
        message: "Saved",
        metadata: post.metadata,
    });
}

const deletePostAdmin = async (req, res) => {
    const { id } = req.body;

    if (!id) {
        return res.status(400).json({
            message: "Invalid post link",
            details: "no post id is provided with the request"
        });
    }

    const post = await Post.findOne({ _id: id });

    if (!post) {
        return res.status(404).json({
            message: "Post not found",
            details: "no post found with the given id"
        });
    }

    await post.deleteOne();

    return res.status(200).json({
        message: "Post deleted",
    });
}


module.exports = {
    createNewPostAdmin,
    getPost,
    getPostAdmin,
    publishPostAdmin,
    updatePostAdmin,
    deletePostAdmin,
};
