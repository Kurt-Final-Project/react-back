const express = require("express");
const router = express.Router();
const { blogController } = require("../controllers");
const { isAuthenticated, multer, validFields } = require("../middlewares");
const blogValidator = require("../validators/blog.validator");

router
	.route("/")
	.get(isAuthenticated, blogController.getBlogs)
	.post(isAuthenticated, blogValidator.createOrUpdateBlog, validFields, blogController.createBlog);

router.route("/user/:user_id").get(isAuthenticated, blogController.getUserPosts);

router
	.route("/:blog_id")
	.get(isAuthenticated, blogValidator.isBlogMongoID, validFields, blogController.getSingleBlogDetails)
	.put(
		isAuthenticated,
		multer.single("picture"),
		blogValidator.createOrUpdateBlog,
		validFields,
		blogController.updateBlog
	)
	.delete(isAuthenticated, blogController.deleteBlog);

module.exports = router;
