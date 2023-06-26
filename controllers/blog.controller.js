const { Blog, User, Comment, Like } = require("../models");
const { errorChecker, cache } = require("../utils");
const client = require("../startup/redis");
const mongoose = require("mongoose");

exports.createBlog = async function (req, res, next) {
	const { description } = req.body;

	const query = {
		description,
		user_id: req.mongoose_id,
	};

	try {
		const blog = await Blog.create(query);
		await blog.populate({
			path: "user_id",
			select: "profile_picture_url first_name last_name user_at",
		});

		await cache(blog._id, blog);

		return res.status(201).json({ message: "Blog created.", blog });
	} catch (err) {
		next(err);
	}
};

exports.getSingleBlogDetails = async (req, res, next) => {
	const { blog_id } = req.params;
	const message = "Blog retrieved.";

	try {
		const cachedBlog = await client.get(blog_id);

		if (cachedBlog) {
			return res.status(200).json({ message, blog: JSON.parse(cachedBlog) });
		}

		const blog = await Blog.findOne({ _id: blog_id }).populate({
			path: "user_id",
			select: "profile_picture_url first_name last_name user_at",
		});

		errorChecker.isExisting(blog, "Blog cannot be found.", 404);

		await cache(blog_id, blog);

		return res.status(200).json({ message, blog });
	} catch (err) {
		next(err);
	}
};

exports.getBlogs = async (req, res, next) => {
	const page = +req.query.page || 1;
	const perPage = +req.query.perPage || 5;
	const skip = (page - 1) * perPage;
	const blogKey = `allBlogs${perPage}-${skip}`;
	const message = "Blogs retrieved.";

	try {
		const totalPromise = Blog.count({});
		const totalCachePromise = client.get("total");
		const cacheBlogsPromise = client.get(blogKey);

		const [totalDocuments, totalCached, cachedBlogs] = await Promise.all([
			totalPromise,
			totalCachePromise,
			cacheBlogsPromise,
		]);

		const hasMore = totalDocuments > skip + perPage;

		if (+totalCached === totalDocuments && cachedBlogs) {
			return res.status(200).json({
				message,
				blogs: JSON.parse(cachedBlogs),
				hasMore,
			});
		}

		const blogs = await Blog.find({})
			.limit(perPage)
			.skip(skip)
			.sort({ updatedAt: -1 })
			.populate({ path: "user_id", select: "profile_picture_url first_name last_name user_at" });

		await cache(blogKey, blogs);
		await cache("total", totalDocuments);

		return res.status(200).json({
			message,
			blogs,
			hasMore,
		});
	} catch (err) {
		next(err);
	}
};

exports.deleteBlog = async (req, res, next) => {
	const { blog_id } = req.params;

	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const filter = { _id: blog_id, user_id: req.mongoose_id };
		const blogToDelete = await Blog.findOne(filter);

		errorChecker.isExisting(blogToDelete, "Blog cannot be found.", 404);
		errorChecker.isAuthorized(blogToDelete?.user_id, req.mongoose_id, "Not authorized to delete.");

		await Blog.deleteOne(filter);
		await Comment.deleteMany({ blog_id });
		await Like.deleteMany({ blog_id });

		await client.del(blog_id);
		await session.commitTransaction();

		return res.status(200).json({ message: "Blog deleted!", blog_id });
	} catch (err) {
		await session.abortTransaction();
		next(err);
	} finally {
		session.endSession();
	}
};

exports.updateBlog = async (req, res, next) => {
	const { blog_id } = req.params;
	const { description } = req.body;

	try {
		const filter = { _id: blog_id, user_id: req.mongoose_id };
		const blog = await Blog.findOneAndUpdate(filter, {
			$set: {
				description,
			},
		});

		errorChecker.isExisting(blog, "Blog cannot be found.", 404);
		errorChecker.isAuthorized(blog?.user_id, req.mongoose_id, "Not authorized to update.");

		return res.status(201).json({ message: "Blog updated!", blog_id });
	} catch (err) {
		next(err);
	}
};

exports.getUserPosts = async (req, res, next) => {
	const { user_id } = req.params;
	const page = +req.query.page || 1;
	const perPage = +req.query.perPage || 5;
	const skip = (page - 1) * perPage;
	const blogKey = `${user_id}-${perPage}-${skip}`;
	const message = "User blogs retrieved.";

	try {
		const filter = { user_id };

		const totalPromise = Blog.count(filter);
		const totalCachePromise = client.get("total");
		const cacheBlogsPromise = client.get(blogKey);

		const [totalDocuments, totalCached, cachedBlogs] = await Promise.all([
			totalPromise,
			totalCachePromise,
			cacheBlogsPromise,
		]);

		const hasMore = totalDocuments > skip + perPage;

		if (+totalCached === totalDocuments && cachedBlogs) {
			return res.status(200).json({
				message,
				blogs: JSON.parse(cachedBlogs),
				hasMore,
			});
		}

		const blogs = await Blog.find(filter)
			.limit(perPage)
			.skip(skip)
			.sort({ updatedAt: -1 })
			.populate({ path: "user_id", select: "profile_picture_url first_name last_name user_at" });

		await cache(blogKey, blogs);
		await cache("total", totalDocuments);

		return res.status(200).json({
			message: "User blogs retrieved.",
			blogs,
			hasMore,
		});
	} catch (err) {
		next(err);
	}
};
