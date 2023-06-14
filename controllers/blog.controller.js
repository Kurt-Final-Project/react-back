const { Blog } = require("../models");
const { errorChecker, cache } = require("../utils");
const client = require("../startup/redis");

exports.createBlog = async function (req, res, next) {
	const { description } = req.body;

	const query = {
		description,
		user_id: req.mongoose_id,
	};

	try {
		const blog = await Blog.create(query);
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

		const blog = await Blog.findOne({ _id: blog_id });
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
		const totalPromise = Blog.count();
		const totalCachePromise = client.get("total");
		const cacheBlogsPromise = client.get(blogKey);

		const [totalDocuments, totalCached, cachedBlogs] = await Promise.all([
			totalPromise,
			totalCachePromise,
			cacheBlogsPromise,
		]);

		if (+totalCached === totalDocuments && cachedBlogs) {
			return res.status(200).json({
				message,
				blogs: JSON.parse(cachedBlogs),
			});
		}

		const blogs = await Blog.find({ deleted_at: null })
			.populate({ path: "user_id", select: "profile_picture_url first_name last_name" })
			.sort({ updatedAt: -1 })
			.limit(perPage)
			.skip(skip);

		await cache(blogKey, blogs);
		await cache("total", totalDocuments);

		return res.status(200).json({
			message,
			blogs,
		});
	} catch (err) {
		next(err);
	}
};

exports.deleteBlog = async (req, res, next) => {
	const { blog_id } = req.params;

	try {
		const filter = { _id: blog_id, user_id: req.mongoose_id, deleted_at: null };
		const blog = await Blog.findOneAndUpdate(filter, {
			$set: {
				description: "POST DELETED",
				deleted_at: new Date(),
			},
		});

		errorChecker.isExisting(blog, "Blog cannot be found.", 404);
		errorChecker.isAuthorized(blog?.user_id, req.mongoose_id, "Not authorized to delete.");

		return res.status(200).json({ message: "Blog deleted!", blog_id });
	} catch (err) {
		next(err);
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
	try {
		const filter = { user_id: req.mongoose_id, deletedAt: { $ne: null } };
		const blogs = await Blog.find(filter)
			.populate({
				path: "user_id",
				select: "-password",
			})
			.sort({ updatedAt: -1 });

		return res.status(200).json({
			message: "User blogs retrieved.",
			blogs,
		});
	} catch (err) {
		next(err);
	}
};
