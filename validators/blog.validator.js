const { body, param } = require("express-validator");

exports.createOrUpdateBlog = [
	body("description")
		.trim()
		.isLength({ min: 5 })
		.withMessage("Description must be at least 5 characters long.")
		.isLength({ max: 1000 })
		.withMessage("Description maximum limit of 1000 characters reached."),
];

exports.isBlogMongoID = [param("blog_id").isMongoId().withMessage("No blog found.")];
