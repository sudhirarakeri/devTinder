const mongoose = require("mongoose");

const connectDB = async () => {
  mongoose.set("strictQuery", true);
  await mongoose.connect(
    "mongodb+srv://mongoLearning:VhGJPlX1k2BVXb2D@mongodblearning.tg6kv5n.mongodb.net/devTinder",
  );
};

module.exports = connectDB;
