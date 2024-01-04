const { body, validationResult } = require("express-validator");

const registrationValidationRules = [
  body("fullName").notEmpty().withMessage("Full name is required"),
  body("email").isEmail().withMessage("Invalid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

const loginValidationRules = [
  body("email").isEmail().withMessage("Invalid email address"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

const refreshValidationRules = [
  body("refreshToken").notEmpty().withMessage("Please provide a refresh token"),
];

const postNoteValidationRules = [
  body("title").notEmpty().withMessage("Title is required"),
  body("content").notEmpty().withMessage("Content is required"),
  body("keywords").isArray().withMessage("Keywords are required"),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty() && errors.array()[0]) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  next();
};

module.exports = {
  registrationValidationRules,
  loginValidationRules,
  refreshValidationRules,
  postNoteValidationRules,
  validate,
};
