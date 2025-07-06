const express = require("express");
const router = express.Router();

// login authentication route
router.get("/login", (req, res) => {
  // Render the login page
  res.render("login", { title: "Login" });
});

// register authentication route
router.get("/register", (req, res) => {
  // Render the registration page
  res.render("register", { title: "Register" });
});

// logout authentication route
router.get("/logout", (req, res) => {
  // Handle user logout
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});
