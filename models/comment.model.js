const mongoose = require("mongoose");

const commentModel = new mongoose.Schema(
	{
		user_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		blog_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Blog",
			required: true,
		},
		comment: {
			type: String,
			required: true,
		},
	},
	{
		timestamps: true,
	}
);

const Comment = mongoose.model("Comment", commentModel);
module.exports = Comment;
