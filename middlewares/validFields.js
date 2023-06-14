const { validationResult } = require("express-validator");

module.exports = (req, res, next) => {
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			const error = new Error(errors.errors[0].msg);
			error.statusCode = 422;
			throw error;
		}
		next();
	} catch (err) {
		next(err);
	}
};
