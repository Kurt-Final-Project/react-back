const crypto = require("crypto");
const { User } = require("../models");
const { jwtSign, errorChecker, passwordHasher, cache } = require("../utils");
const client = require("../startup/redis");

const tokenGenerator = (user) => {
	return jwtSign({
		mongoose_id: user._id,
		user_id: user._id,
		email: user.email,
		profile_picture_url: user.profile_picture_url,
	});
};

const initialUserAt = (first_name, last_name) => {
	const first = first_name.slice(0, 2).toLowerCase().split(" ").join("");
	const last = last_name.slice(0, 5).toLowerCase().split(" ").join("");
	const uuid = crypto.randomUUID().split("-")[0];

	return first + last + uuid;
};

exports.loginUser = async (req, res, next) => {
	const { email, password } = req.body;

	try {
		const user = await User.findOne({ email });
		errorChecker.isPasswordCorrect(user?.password, password, "No user found.", 404);

		const { token, expirationDate } = tokenGenerator(user);

		return res.status(200).json({ message: "Login success!", token, expirationDate });
	} catch (err) {
		next(err);
	}
};

exports.signupUser = async (req, res, next) => {
	const { first_name, last_name, email, password } = req.body;

	try {
		const isUserExisting = await User.findOne({ email });
		errorChecker.isExisting(!isUserExisting, "User with that email already exist.", 403);

		const hashedPassword = passwordHasher(password);
		const user = await User.create({
			first_name,
			last_name,
			user_at: initialUserAt(first_name, last_name),
			email,
			password: hashedPassword,
			profile_picture_url: "public/covers/sample_profile.jpg",
		});

		const { token, expirationDate } = tokenGenerator(user);

		return res.status(201).json({ message: "User created successfully", token, expirationDate });
	} catch (err) {
		next(err);
	}
};

exports.getUser = async (req, res, next) => {
	const { user_id } = req.params;
	const { own } = req.query;
	const message = "User retrieved successfully.";

	try {
		if (own) errorChecker.isAuthorized(req.user_id, user_id, "Credentials mismatched.");

		const userCached = await client.get(user_id);
		if (userCached) {
			return res.status(200).json({ message, user: JSON.parse(userCached) });
		}

		const user = await User.findOne({ _id: user_id }).select("-password");
		errorChecker.isExisting(user, "No user found.", 404);

		await cache(user_id, user);

		return res.status(200).json({ message, user });
	} catch (err) {
		next(err);
	}
};

exports.updateUserDetails = async (req, res, next) => {
	let { first_name, last_name, user_at, bio, birthday } = req.body;

	try {
		const isExisting = await User.findOne({
			user_at,
			_id: {
				$ne: req.mongoose_id,
			},
		});

		errorChecker.isExisting(!isExisting, "User with that username already exist.", 403);

		const user = await User.findOneAndUpdate(
			{ _id: req.mongoose_id },
			{
				$set: {
					first_name,
					last_name,
					bio,
					user_at,
					birthday,
				},
			},
			{
				new: true,
			}
		).select("-password");

		errorChecker.isExisting(user, "No user found to update.", 404);
		await cache(user._id, user);

		return res.status(200).json({
			message: "User details updated.",
		});
	} catch (err) {
		console.log(err);
		next(err);
	}
};

exports.updateUserPicture = async (req, res, next) => {
	try {
		errorChecker.hasFile(req.file);
		const filePath = req.file.path.split("\\").join("/");

		const user = await User.findOneAndUpdate(
			{ _id: req.mongoose_id },
			{
				$set: { profile_picture_url: filePath },
			}
		).select("-password");

		await cache(user._id, user);

		return res.status(201).json({
			message: "User profile picture updated.",
			newPicture: filePath,
		});
	} catch (err) {
		next(err);
	}
};

exports.changeUserPassword = async (req, res, next) => {
	const { password, oldPassword } = req.body;

	try {
		const user = await User.findOne({ _id: req.mongoose_id });

		errorChecker.isExisting(user, "No user found.", 404);
		errorChecker.isPasswordCorrect(user.password, oldPassword, "Password does not match with the previous one.", 403);
		errorChecker.isPasswordSameAsPrevious(user.password, password);
		errorChecker.hasUsedAllChances(user.password_chances);

		await User.updateOne(
			{ _id: req.mongoose_id },
			{
				$set: {
					password: passwordHasher(password),
					password_chances: user.password_chances + 1,
				},
			}
		);

		return res.status(200).json({
			message: "User password changed.",
		});
	} catch (err) {
		next(err);
	}
};
