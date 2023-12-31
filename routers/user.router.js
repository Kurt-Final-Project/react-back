const express = require("express");
const router = express.Router();
const { userController } = require("../controllers");
const { isAuthenticated, multer, validFields } = require("../middlewares");
const userValidator = require("../validators/user.validator");

router.route("/login").post(userValidator.emailPasswordLogin, validFields, userController.loginUser);

router
	.route("/signup")
	.post(
		multer.single("picture"),
		userValidator.userFields,
		userValidator.updateUserPassword,
		validFields,
		userController.signupUser
	);

router
	.route("/profile")
	.put(
		isAuthenticated,
		userValidator.updateUserFields,
		userValidator.userAt,
		validFields,
		userController.updateUserDetails
	)
	.patch(isAuthenticated, multer.single("picture"), userController.updateUserPicture);

router
	.route("/profile/:user_id")
	.get(isAuthenticated, userValidator.isUserMongoID, validFields, userController.getUser);

router
	.route("/password/change")
	.put(isAuthenticated, userValidator.updateUserPassword, validFields, userController.changeUserPassword);

module.exports = router;
