const { body } = require("express-validator");

const emailField = body("email", "Email should only contain letters and a subaddress.")
	.trim()
	.normalizeEmail()
	.isEmail()
	.isAlphanumeric("en-US", { ignore: "@._" })
	.custom((value, { req }) => {
		if (value.split("@")[1] === "stratpoint.com") return true;
		return false;
	})
	.withMessage("Provider not supported. Please use another email provider.");

const passwordSignupField = body("password", "Password must contain at least 8 alphanumeric characters.")
	.isAlphanumeric()
	.trim()
	.isLength({ min: 8 });

const passwordLoginField = body("password", "Password is required.").trim().notEmpty();

exports.emailPasswordLogin = [emailField, passwordLoginField];

exports.userFields = [
	emailField,

	body(["first_name", "last_name"], "Name fields must only contain letters.")
		.trim()
		.isLength({ min: 3 })
		.withMessage("Name fields must be at least 3 characters long.")
		.customSanitizer((value) => {
			const words = value.split(" ");

			const camelCasedWords = words.map((word, index) => {
				return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
			});

			return camelCasedWords.join(" ");
		})
		.isAlpha("en-US", { ignore: " '" }),
];

exports.userAt = [
	body("user_at", "Username should only contain letters and numbers.")
		.trim()
		.isLength({ min: 5 })
		.withMessage("Username field must be at least 5 characters long.")
		.toLowerCase()
		.isAlphanumeric("en-US"),
];

exports.updateUserPassword = [
	passwordSignupField,

	body("confirmPassword", "Password does not match.")
		.trim()
		.custom((value, { req }) => {
			if (value !== req.body.password) return false;
			return true;
		}),
];
