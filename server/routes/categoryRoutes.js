const express = require("express");
const { body } = require("express-validator"); // For validation
const {
  getCategories,
  createCategory,
} = require("../controllers/categoryController");
const { validate } = require("../middleware/validationMiddleware"); // Custom validation middleware

const router = express.Router();

// Validation rules for creating a category
const createCategoryValidationRules = [
  body("name")
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Category name must be between 3 and 50 characters")
    .trim()
    .escape(), // Sanitize input
];

router
  .route("/")
  .get(getCategories)
  .post(createCategoryValidationRules, validate, createCategory);

module.exports = router;
