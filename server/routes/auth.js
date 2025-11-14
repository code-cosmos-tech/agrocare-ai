const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/auth-controller");
const validate = require("../zod-models/validate");
const validator = require("../middlewares/validator");

// ✅ Register Route
router
  .route("/register")
  .post(validator(validate.registerSchema), authControllers.register);

// ✅ Login Route
router
  .route("/login")
  .post(validator(validate.loginSchema), authControllers.login);

router.get("/login", (req, res) => res.send("Login route working ✅"));

module.exports = router;