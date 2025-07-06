const Category = require("../models/Category");
const asyncHandler = require("express-async-handler"); // Simple middleware for handling exceptions inside of async express routes

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({});
  res.json(categories);
});

// @desc    Create a new category
// @route   POST /api/categories
// @access  Public
const createCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const categoryExists = await Category.findOne({ name });

  if (categoryExists) {
    res.status(400);
    throw new Error("Category with this name already exists");
  }

  const category = await Category.create({ name });

  res.status(201).json(category);
});

module.exports = {
  getCategories,
  createCategory,
};
