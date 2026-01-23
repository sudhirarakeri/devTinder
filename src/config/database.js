const mongoose = require("mongoose");

const connectDB = async () => {
  mongoose.set("strictQuery", true);
  await mongoose.connect(process.env.DB_CONNECTION_STRING);
};

module.exports = connectDB;
