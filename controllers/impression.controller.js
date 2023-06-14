const { Comment, Like } = require("../models");
const client = require("../startup/redis");
const { cache, errorChecker } = require("../utils");

exports.getComments = async (req, res, next) => {
	const { blog_id } = req.params;

	const commentKey = `comment-${blog_id}`;
	const commentCounterKey = `comment-${blog_id}-count`;
	const message = "Comments retrieved.";

	try {
		const commentCount = await Comment.count();
		const cachedComments = await client.get(commentKey);
		const cachedCommentCounter = await client.get(commentCounterKey);

		if (commentCount === +cachedCommentCounter && cachedComments) {
			return res.status(200).json({
				message,
				comments: JSON.parse(cachedComments),
			});
		}

		const populate = { path: "user_id", select: "profile_picture_url first_name last_name -_id" };
		const comments = await Comment.find({ blog_id }).populate(populate);

		await cache(commentKey, comments);
		await cache(commentCounterKey, commentCount);

		return res.status(200).json({
			message,
			comments,
		});
	} catch (err) {
		next(err);
	}
};

exports.addComment = async (req, res, next) => {
	const { blog_id, commentText } = req.body;

	try {
		const filter = { user_id: req.mongoose_id, blog_id, comment: commentText };
		const comment = await Comment.create(filter);

		return res.status(201).json({ message: "Comment successfully added to post!", comment });
	} catch (err) {
		next(err);
	}
};

exports.deleteComment = async (req, res, next) => {
	const { blog_id } = req.params;
	const { comment_id } = req.body;

	try {
		const filter = { _id: comment_id, user_id: req.mongoose_id, blog_id };
		const comment = await Comment.findOneAndDelete(filter);

		errorChecker.isAuthorized(comment?.user_id, req.mongoose_id, "Not authorized to delete comment.");

		return res.status(201).json({ message: "Comment successfully deleted." });
	} catch (err) {
		next(err);
	}
};

exports.editComment = async (req, res, next) => {
	const { comment_id, commentText } = req.body;

	try {
		const filter = { _id: comment_id, user_id: req.mongoose_id };
		const comment = await Comment.findOneAndUpdate(
			filter,
			{
				$set: {
					comment: commentText,
				},
			},
			{
				new: true,
			}
		);
		console.log(comment);

		errorChecker.isAuthorized(comment?.user_id, req.mongoose_id, "Not authorized to update comment.");

		return res.status(201).json({ message: "Comment successfully updated." });
	} catch (err) {
		next(err);
	}
};

exports.getLikes = async (req, res, next) => {
	const { blog_id } = req.params;

	try {
		const likes = await Like.count({ blog_id });

		return res.status(200).json({ message: "Likes retrieved.", likes });
	} catch (err) {
		next(err);
	}
};

exports.addLike = async (req, res, next) => {
	const { blog_id, isLiking } = req.body;

	try {
		const filter = { blog_id, user_id: req.mongoose_id };

		if (isLiking) {
			await Like.updateOne(
				filter,
				{
					$set: filter,
				},
				{
					upsert: true,
				}
			);
		} else {
			await Like.deleteOne(filter);
		}

		return res.status(201).json({ message: "Likes updated." });
	} catch (err) {
		next(err);
	}
};
