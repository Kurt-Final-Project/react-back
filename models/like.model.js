const mongoose = require("mongoose");

const likeModel = new mongoose.Schema({
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
});

const Like = mongoose.model("Like", likeModel);
module.exports = Like;
