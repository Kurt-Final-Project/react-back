const { body } = require("express-validator");

exports.createOrUpdateComment = [body("comment").trim().notEmpty().withMessage("Comment must be not be empty.")];
