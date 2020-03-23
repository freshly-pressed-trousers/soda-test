const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const initDatabase = async () => {
	const mongoServer = new MongoMemoryServer();

	const mongoUri = await mongoServer.getUri();
	mongoose.connect(mongoUri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});

	mongoose.connection.on("error", console.error);

	mongoose.connection.once("open", () =>
		console.log(`MongoDB successfully connected to ${mongoUri}`)
	);
};

module.exports = initDatabase;
