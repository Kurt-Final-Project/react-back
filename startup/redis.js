const { createClient } = require("redis");

// const client = createClient({
// 	password: process.env.REDIS_PASS,
// 	socket: {
// 		host: process.env.REDIS_HOST | "localhost",
// 		port: process.env.REDIS_PORT | 6379,
// 	},
// });

const client = createClient({
	host: "localhost",
	port: 6379,
});

client.on("error", (err) => {
	console.error("Redis error:", err);
	throw err;
});

client.on("connect", () => {
	console.log("Redis client connected");
});

module.exports = client;
