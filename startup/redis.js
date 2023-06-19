const { createClient } = require("redis");

const client = createClient({
	username: process.env.REDS_USER || "default",
	password: process.env.REDIS_PASS || "password",
	socket: {
		host: process.env.REDIS_HOST || "localhost",
		port: process.env.REDIS_PORT || 6379,
	},
});

client.on("error", (err) => {
	console.error("Redis error:", err);
	throw err;
});

client.on("connect", () => {
	console.log("Redis client connected");
});

module.exports = client;
