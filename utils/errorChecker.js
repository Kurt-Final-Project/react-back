const passwordHasher = require("./passwordHasher");

exports.hasFile = (file) => {
	if (!file) {
		const error = new Error("Picture is required and must be in jpg/png format.");
		error.statusCode = 422;
		throw error;
	}
	return;
};

exports.isExisting = (payload, msg, code) => {
	if (!payload) {
		const error = new Error(msg);
		error.statusCode = code;
		throw error;
	}
	return;
};

exports.isAuthorized = (userId, reqId, msg) => {
	if (userId?.toString() !== reqId) {
		const error = new Error(msg);
		error.statusCode = 403;
		throw error;
	}
	return;
};

exports.isPasswordCorrect = (userPassword, passwordInput, msg, code) => {
	if (userPassword !== passwordHasher(passwordInput)) {
		const error = new Error(msg);
		error.statusCode = code;
		throw error;
	}
	return;
};

exports.isPasswordSameAsPrevious = (userPassword, newPassword) => {
	if (userPassword === passwordHasher(newPassword)) {
		const error = new Error("Password must not be the same as the previous one.");
		error.statusCode = 422;
		throw error;
	}
	return;
};

exports.hasUsedAllChances = (chances) => {
	if (chances >= 3) {
		const error = new Error("You have used all your change password chances.");
		error.statusCode = 403;
		throw error;
	}
	return;
};
