const client = require("../startup/redis");

const expirationTime = Math.floor(Date.now() / 1000) + 60 * 5; // 5mins

module.exports = async (key, value) => {
	try {
		const rkey = key.toString();
		await client.set(rkey, JSON.stringify(value));
		await client.expireAt(rkey, expirationTime);
	} catch (err) {
		throw err;
	}
};
