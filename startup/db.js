const mongoose = require("mongoose");

module.exports = async () => {
	try {
		await mongoose.connect(
			process.env.ENVIRONMENT === "DEV"
				? process.env.MONGODB_URI + process.env.DB_COLL
				: `mongodb+srv://kurt:${process.env.DB_PASSWORD}@cluster0.7gdpzrx.mongodb.net/${process.env.DB_COLL}`,
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
			}
		);
		console.log("connected to db");
	} catch (err) {
		throw err;
	}
};
