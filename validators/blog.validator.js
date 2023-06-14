const { body } = require("express-validator");

exports.createOrUpdateBlog = [
	body("description").trim().isLength({ min: 5 }).withMessage("Description must be at least 5 characters long."),
];
