const jwt = require("jsonwebtoken");

module.exports = (payload) => {
	const minutesToExpire = 60 * 60 * 1; // 1h
	const expirationDate = Date.now() + 1000 * minutesToExpire;

	return {
		token: jwt.sign(payload, process.env.JWT_SECRET, {
			expiresIn: minutesToExpire,
		}),
		expirationDate,
	};
};
