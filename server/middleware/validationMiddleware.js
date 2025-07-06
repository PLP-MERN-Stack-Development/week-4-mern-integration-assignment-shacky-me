const { validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next(); // No validation errors, proceed to the next middleware/controller
  }
  // If there are errors, send a 400 Bad Request response with the error details
  res.status(400).json({ errors: errors.array() });
};

module.exports = { validate };
