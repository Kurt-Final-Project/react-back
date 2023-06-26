const { faker } = require("@faker-js/faker");
const mongoose = require("mongoose");
const { User, Blog, Like, Comment } = require("./models");
const path = require("path");
const { passwordHasher } = require("./utils");

require("dotenv").config();

const produceFakeBlogs = async () => {
	const online = `mongodb+srv://kurt:${process.env.DB_PASSWORD}@cluster0.7gdpzrx.mongodb.net/${process.env.DB_COLL}`;
	const local = process.env.MONGODB_URI + process.env.DB_COLL;
	await mongoose.connect(online, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});

	await User.deleteMany();
	await Blog.deleteMany();
	await Comment.deleteMany();
	await Like.deleteMany();

	const maxUsers = 5;
	const blogsPerUser = 3;

	const testUser = await User.create({
		first_name: "kurt",
		last_name: "testing",
		user_at: "kurt69",
		email: "test@stratpoint.com",
		password: passwordHasher("123123123"),
		profile_picture_url: path.join("public", "covers", "0.png").split("\\").join("/"),
	});

	const testUser2 = await User.create({
		first_name: "kurt",
		last_name: "testing",
		user_at: "kurt68",
		email: "test1@stratpoint.com",
		password: passwordHasher("123123123"),
		profile_picture_url: path.join("public", "covers", "0.png").split("\\").join("/"),
	});

	let users = [];
	let blogs = [];

	for (let i = 0; i < maxUsers; i++) {
		const first_name = faker.name.firstName();
		const last_name = faker.name.lastName();
		const img = Math.floor(Math.random() * 5) + ".png";

		const name = first_name + last_name + faker.datatype.uuid().split("-")[0].slice(0, 4);
		const userAt = name.split(" ").join("").toLowerCase();

		const user = await User.create({
			first_name,
			last_name,
			user_at: userAt,
			email: faker.internet.email(first_name.toLowerCase(), last_name.toLowerCase(), "stratpoint.com"),
			password: passwordHasher("123123123"),
			profile_picture_url: path.join("public", "covers", img).split("\\").join("/"),
		});

		users.push(user);

		for (let i = 0; i < blogsPerUser; i++) {
			const img = Math.floor(Math.random() * 5) + ".png";
			const blog = await Blog.create({
				description: i + faker.commerce.productName(),
				user_id: user._id,
			});

			blogs.push(blog);
		}
	}

	for (let i = 0; i < maxUsers * 3; i++) {
		const rand = Math.floor(Math.random() * 5);
		const anotherRand = Math.floor(Math.random() * 5);
		await Comment.create({
			user_id: users[rand],
			blog_id: blogs[anotherRand],
			comment: faker.commerce.productDescription(),
		});
		await Like.create({ user_id: users[anotherRand], blog_id: blogs[rand] });
	}

	console.log("seeds created");
	return process.exit();
};

produceFakeBlogs();
