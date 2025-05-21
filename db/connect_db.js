const mongoose = require("mongoose");

// Cache the database connection
let cachedDb = null;

const mongooseConnection = async (url) => {
  // If the connection is already established, reuse it
  if (cachedDb) {
    return cachedDb;
  }

  // Set important mongoose options for serverless environments
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // Serverless environments need these settings
    bufferCommands: false, // Disable mongoose buffering
    serverSelectionTimeoutMS: 5000, // Fail fast if unable to connect
    connectTimeoutMS: 10000, // Give enough time to connect
  };

  // Connect to the database
  mongoose.set('strictQuery', false);
  const db = await mongoose.connect(url, options);
  
  // Cache the database connection for future use
  cachedDb = db;
  return db;
};

module.exports = mongooseConnection;