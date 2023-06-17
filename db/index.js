const mongoose = require("mongoose");

const {
  dbAdmin,
  dbHost,
  dbPassword,
  dbName,
} = require("../src/config/db.config");

const mongoConnect = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${dbAdmin}:${dbPassword}@${dbHost}/${dbName}?retryWrites=true&w=majority`
    );
    console.log("Connected to MongoDB");
  } catch (error) {
    console.log(error);
  }
};

module.exports = mongoConnect;
