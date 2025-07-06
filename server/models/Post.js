const mongoose = require("mongoose");

const postSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Post title is required"],
      trim: true,
      minlength: [5, "Title must be at least 5 characters long"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    content: {
      type: String,
      required: [true, "Post content is required"],
      minlength: [10, "Content must be at least 10 characters long"],
    },
    author: {
      type: String,
      required: [true, "Author name is required"],
      trim: true,
      minlength: [3, "Author name must be at least 3 characters long"],
      maxlength: [50, "Author name cannot exceed 50 characters"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId, // Reference to Category model
      ref: "Category", // The name of the model to which it refers
      required: [true, "Category is required"],
    },
    tags: {
      type: [String], // Array of strings
      default: [],
    },
    published: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
