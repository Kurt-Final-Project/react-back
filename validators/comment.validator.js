const { body } = require("express-validator");

exports.createOrUpdateComment = [
	body("comment")
		.trim()
		.notEmpty()
		.withMessage("Comment must be not be empty.")
		.isLength({ max: 250 })
		.withMessage("Description maximum limit of 300 characters reached."),
];
