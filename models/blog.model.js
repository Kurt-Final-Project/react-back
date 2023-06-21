const mongoose = require("mongoose");

const blogModel = new mongoose.Schema(
	{
		user_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Blog = mongoose.model("Blog", blogModel);
module.exports = Blog;
