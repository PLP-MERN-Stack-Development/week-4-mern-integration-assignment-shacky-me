const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
      trim: true,
      minlength: [3, "Category name must be at least 3 characters long"],
      maxlength: [50, "Category name cannot exceed 50 characters"],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

const Category = mongoose.model("Category", categorySchema);

module.exports = Category;
