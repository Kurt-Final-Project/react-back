module.exports = async (app) => {
	app.use("/api/user", require("./user.router"));
	app.use("/api/blog", require("./blog.router"));
	app.use("/api/impression", require("./impression.router"));
};
