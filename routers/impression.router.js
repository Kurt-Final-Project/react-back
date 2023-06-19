const express = require("express");
const router = express.Router();
const { isAuthenticated, validFields } = require("../middlewares");
const { impressionController } = require("../controllers");
const commentValidator = require("../validators/comment.validator");

router
	.route("/comment")
	.post(isAuthenticated, commentValidator.createOrUpdateComment, validFields, impressionController.addComment)
	.put(isAuthenticated, commentValidator.createOrUpdateComment, validFields, impressionController.editComment);

router
	.route("/comment/:blog_id")
	.get(isAuthenticated, impressionController.getComments)
	.put(isAuthenticated, impressionController.deleteComment);

router.route("/like").post(isAuthenticated, impressionController.addLike);
router.route("/:blog_id").get(isAuthenticated, impressionController.getLikesAndCommentsCount);

module.exports = router;
