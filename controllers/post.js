const Post = require("@/db/models/post");


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
        id: post._id,
        ...post.toObject(),
    });
};

const getAllPosts = async (req, res) => {
    const { page, limit } = req.query;
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;

    const skip = (pageNum - 1) * limitNum;

    const posts = await Post.find({ published: true }).sort({ createdAt: -1 }).skip(skip).limit(limitNum);
    return res.status(200).json({
        message: "Posts fetched successfully",
        posts: posts.map(post => ({
            id: post._id,
            ...post.toObject(),
        })),
    });

}




// ------------------IMPORTANT------------------
//
// Checking for admin credentials are expected to be handled
// by middlewares

// New post

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
        id: post._id,
        ...post.toObject(),
    });
}

const getAllDraftsAdmin = async (req, res) => {
    const posts = await Post.find({ published: false }).sort({ createdAt: -1 });
    return res.status(200).json({
        message: "Drafts fetched successfully",
        drafts: posts.map(post => ({
            id: post._id,
            ...post.toObject(),
        })),
    });
}

const createNewPostAdmin = async (req, res) => {

    const newPost = await Post.create({});

    return res.status(201).json({
        message: "Post created.",
        id: newPost._id,
    });
}

const publishPostAdmin = async (req, res) => {
    const { id, published } = req.body;

    if (!id) {
        return res.status(400).json({
            message: "Invalid post link",
            details: "no post id is provided with the request"
        });
    }

    const post = await Post.findOne({ _id: id });

    if (published && !post.title) {
        return res.status(400).json({
            message: "Post must have a title before publishing",
            details: "no title is found in the post"
        });
    }

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
        id: post._id,
        ...post.toObject(),
    });
}

const updatePostAdmin = async (req, res) => {
    const { id, title, metadata } = req.body;

    if (!title || !metadata) {
        return res.status(400).json({
            message: "Invalid post data",
            details: "no title or metadata is provided with the request"
        });
    }

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

    post.title = title.trim();
    post.metadata = metadata;
    await post.save();

    res.status(200).json({
        message: "Saved",
        id: post._id,
        ...post.toObject(),
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
    getAllPosts,
    getAllDraftsAdmin,
    publishPostAdmin,
    updatePostAdmin,
    deletePostAdmin,
};
