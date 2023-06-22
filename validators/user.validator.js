const { body } = require("express-validator");

const emailField = body("email", "Email should only contain letters and a subaddress.")
	.trim()
	.normalizeEmail()
	.isEmail()
	.custom((value, { req }) => {
		if (value.split("@")[1] === "stratpoint.com") return true;
		return false;
	})
	.withMessage("Provider not supported. Please use another email provider.");

const passwordSignupField = body("password", "Password must contain at least 8 alphanumeric and !@#.+- characters.")
	.isAlphanumeric("en-US", { ignore: "!@#.+-" })
	.trim()
	.isLength({ min: 8 });

const passwordLoginField = body("password", "Password is required.").trim().notEmpty();

const userGivenName = body(["first_name", "last_name"], "Name fields must only contain letters.")
	.trim()
	.isLength({ min: 2 })
	.withMessage("Name fields must not be empty.")
	.customSanitizer((value) => {
		const words = value.split(" ");

		const camelCasedWords = words.map((word, index) => {
			return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
		});

		return camelCasedWords.join(" ");
	})
	.isAlpha("en-US", { ignore: " '" });

const bioField = body("bio").trim().isLength({ min: 3 }).withMessage("Bio must be at least 3 characters long.");
const birthdayField = body("birthday")
	.notEmpty()
	.withMessage("Birthday must not be empty.")
	.isDate()
	.withMessage("Invalid date format");

exports.emailPasswordLogin = [emailField, passwordLoginField];

exports.userFields = [emailField, userGivenName];

exports.updateUserFields = [userGivenName, bioField, birthdayField];

exports.userAt = [
	body("user_at", "Username should only contain letters and numbers.")
		.trim()
		.isLength({ min: 4 })
		.withMessage("Username field must be at least 4 characters long.")
		.toLowerCase()
		.isAlphanumeric("en-US")
		.withMessage("Username field must only contain alphanumeric characters."),
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
