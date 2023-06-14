const { body } = require("express-validator");

exports.createOrUpdateComment = [body("comment").trim().isLength({ min: 3 }).withMessage("Comment must be at least 3 characters long.")];
