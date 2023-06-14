const mongoose = require("mongoose");

module.exports = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI + process.env.DB_COLL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log("connected to db");
	} catch (err) {
		throw err;
	}
};
