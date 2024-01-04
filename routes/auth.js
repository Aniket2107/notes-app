const router = require("express").Router();

const authController = require("../controllers/auth");
const validation = require("../helpers/validate");

router.post(
  "/signup",
  [validation.registrationValidationRules, validation.validate],
  authController.signup
);

router.post(
  "/login",
  [validation.loginValidationRules, validation.validate],
  authController.login
);

router.post(
  "/refresh",
  [validation.refreshValidationRules, validation.validate],
  authController.refreshToken
);

module.exports = router;
