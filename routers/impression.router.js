const express = require("express");
const router = express.Router();
const { isAuthenticated } = require("../middlewares");
const { impressionController } = require("../controllers");
const commentValidator = require("../validators/comment.validator");

router
	.route("/comment")
	.post(isAuthenticated, commentValidator.createOrUpdateComment, impressionController.addComment)
	.put(isAuthenticated, commentValidator.createOrUpdateComment, impressionController.editComment);

router
	.route("/comment/:blog_id")
	.get(isAuthenticated, impressionController.getComments)
	.put(isAuthenticated, impressionController.deleteComment);

router.route("/like").post(isAuthenticated, impressionController.addLike);
router.route("/like/:blog_id").get(isAuthenticated, impressionController.getLikes);

module.exports = router;
