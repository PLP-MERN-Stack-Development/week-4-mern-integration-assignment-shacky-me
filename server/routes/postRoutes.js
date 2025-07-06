const express = require("express");
const { body, param } = require("express-validator"); // For validation
const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/postController");
const { validate } = require("../middleware/validationMiddleware"); // Custom validation middleware

const router = express.Router();

// Validation rules for creating a post
const createPostValidationRules = [
  body("title")
    .notEmpty()
    .withMessage("Title is required")
    .isLength({ min: 5, max: 100 })
    .withMessage("Title must be between 5 and 100 characters")
    .trim()
    .escape(),
  body("content")
    .notEmpty()
    .withMessage("Content is required")
    .isLength({ min: 10 })
    .withMessage("Content must be at least 10 characters long")
    .trim(),
  body("author")
    .notEmpty()
    .withMessage("Author is required")
    .isLength({ min: 3, max: 50 })
    .withMessage("Author name must be between 3 and 50 characters")
    .trim()
    .escape(),
  body("category")
    .notEmpty()
    .withMessage("Category ID is required")
    .isMongoId()
    .withMessage("Invalid Category ID format"),
  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array of strings")
    .custom((value) => value.every((tag) => typeof tag === "string"))
    .withMessage("Each tag must be a string"),
  body("published")
    .optional()
    .isBoolean()
    .withMessage("Published must be a boolean"),
];

// Validation rules for updating a post (all fields optional for update)
const updatePostValidationRules = [
  body("title")
    .optional()
    .isLength({ min: 5, max: 100 })
    .withMessage("Title must be between 5 and 100 characters")
    .trim()
    .escape(),
  body("content")
    .optional()
    .isLength({ min: 10 })
    .withMessage("Content must be at least 10 characters long")
    .trim(),
  body("author")
    .optional()
    .isLength({ min: 3, max: 50 })
    .withMessage("Author name must be between 3 and 50 characters")
    .trim()
    .escape(),
  body("category")
    .optional()
    .isMongoId()
    .withMessage("Invalid Category ID format"),
  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array of strings")
    .custom((value) => value.every((tag) => typeof tag === "string"))
    .withMessage("Each tag must be a string"),
  body("published")
    .optional()
    .isBoolean()
    .withMessage("Published must be a boolean"),
];

// Reusable ID validation for params
const idValidationRule = [
  param("id").isMongoId().withMessage("Invalid ID format"),
];

router
  .route("/")
  .get(getPosts)
  .post(createPostValidationRules, validate, createPost);
router
  .route("/:id")
  .get(idValidationRule, validate, getPostById)
  .put(idValidationRule, updatePostValidationRules, validate, updatePost)
  .delete(idValidationRule, validate, deletePost);

module.exports = router;
