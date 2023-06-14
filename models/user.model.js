const mongoose = require("mongoose");

const userModel = new mongoose.Schema(
	{
		first_name: {
			type: String,
			required: true,
		},
		last_name: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			unique: true,
			required: true,
		},
		user_at: {
			type: String,
			unique: true,
			required: true,
		},
		birthday: {
			type: Date,
		},
		password: {
			type: String,
			required: true,
		},
		bio: {
			type: String,
		},
		profile_picture_url: {
			type: String,
			required: true,
		},
		password_chances: {
			type: Number,
			default: 0,
		},
	},
	{ timestamps: true }
);

const User = mongoose.model("User", userModel);
module.exports = User;
