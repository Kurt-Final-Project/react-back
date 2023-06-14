const app = require("./startup/app");
const db = require("./startup/db");
const client = require("./startup/redis");

require("./routers")(app);

app.use(async (err, req, res, next) => {
	let { statusCode, message } = err;
	statusCode = statusCode || 500;
	return res.status(statusCode).json({ message });
});

app.use((req, res, next) => {
	res.send("No page found");
});

const startServer = async () => {
	try {
		await db();
		await client.connect();
		app.listen(process.env.PORT, () => {
			console.log(`server started at port: ${process.env.PORT}`);
		});
	} catch (err) {
		await client.quit();
		throw err;
	}
};

startServer();
