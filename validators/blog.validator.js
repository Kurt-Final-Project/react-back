const { body, param } = require("express-validator");

exports.createOrUpdateBlog = [
	body("description").trim().isLength({ min: 5 }).withMessage("Description must be at least 5 characters long."),
];

exports.isBlogMongoID = [param("blog_id").isMongoId().withMessage("No blog found.")];
