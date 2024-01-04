const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongod;

exports.connectDB = async () => {
  const url = process.env.DB_URI;
  const isTestEnvironment = process.env.NODE_ENV === "test";

  try {
    if (isTestEnvironment) {
      mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      await mongoose.connect(uri);
    } else {
      await mongoose.connect(url);
    }
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }

  const dbConnection = mongoose.connection;
  dbConnection.once("open", (_) => {
    console.log(`Database connected`);
  });

  dbConnection.on("error", (err) => {
    console.error(`Connection error: ${err}`);
  });

  return;
};

exports.disconnectDB = async () => {
  if (process.env.NODE_ENV === "test") {
    if (mongod) {
      await mongoose.connection.close();
      await mongod.stop();
    }
  } else {
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
  }
};
