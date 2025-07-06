const Post = require("../models/Post");
const asyncHandler = require("express-async-handler"); // Simple middleware for handling exceptions inside of async express routes
const mongoose = require("mongoose");

// @desc    Get all blog posts
// @route   GET /api/posts
// @access  Public
const getPosts = asyncHandler(async (req, res) => {
  // Populate the 'category' field to get category details instead of just ID
  const posts = await Post.find({}).populate("category", "name"); // Only populate 'name' field of category
  res.json(posts);
});

// @desc    Get a specific blog post by ID
// @route   GET /api/posts/:id
// @access  Public
const getPostById = asyncHandler(async (req, res) => {
  // Validate if the ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid Post ID format");
  }

  const post = await Post.findById(req.params.id).populate("category", "name");

  if (post) {
    res.json(post);
  } else {
    res.status(404);
    throw new Error("Post not found");
  }
});

// @desc    Create a new blog post
// @route   POST /api/posts
// @access  Public
const createPost = asyncHandler(async (req, res) => {
  const { title, content, author, category, tags, published } = req.body;

  // Check if category ID is valid
  if (!mongoose.Types.ObjectId.isValid(category)) {
    res.status(400);
    throw new Error("Invalid Category ID format");
  }

  const post = await Post.create({
    title,
    content,
    author,
    category, // This should be a valid Category ObjectId
    tags: tags || [],
    published: published || false,
  });

  // Populate the category field before sending the response
  const createdPost = await Post.findById(post._id).populate(
    "category",
    "name"
  );

  res.status(201).json(createdPost);
});

// @desc    Update an existing blog post
// @route   PUT /api/posts/:id
// @access  Public
const updatePost = asyncHandler(async (req, res) => {
  const { title, content, author, category, tags, published } = req.body;

  // Validate if the ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid Post ID format");
  }

  const post = await Post.findById(req.params.id);

  if (post) {
    // If category is provided, validate it
    if (category && !mongoose.Types.ObjectId.isValid(category)) {
      res.status(400);
      throw new Error("Invalid Category ID format");
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.author = author || post.author;
    post.category = category || post.category;
    post.tags = tags !== undefined ? tags : post.tags; // Allow empty array for tags
    post.published = published !== undefined ? published : post.published; // Allow false for published

    const updatedPost = await post.save();

    // Populate the category field before sending the response
    const populatedUpdatedPost = await Post.findById(updatedPost._id).populate(
      "category",
      "name"
    );

    res.json(populatedUpdatedPost);
  } else {
    res.status(404);
    throw new Error("Post not found");
  }
});

// @desc    Delete a blog post
// @route   DELETE /api/posts/:id
// @access  Public
const deletePost = asyncHandler(async (req, res) => {
  // Validate if the ID is a valid MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    res.status(400);
    throw new Error("Invalid Post ID format");
  }

  const post = await Post.findById(req.params.id);

  if (post) {
    await Post.deleteOne({ _id: req.params.id }); // Use deleteOne or findByIdAndDelete
    res.json({ message: "Post removed" });
  } else {
    res.status(404);
    throw new Error("Post not found");
  }
});

module.exports = {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
};
