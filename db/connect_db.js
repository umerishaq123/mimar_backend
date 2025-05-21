const mongoose = require("mongoose");

let cachedConnection = null;

const mongooseConnection = async (url) => {
  // Return cached connection if available
  if (cachedConnection) {
    return cachedConnection;
  }

  // Set mongoose options for serverless environments
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    bufferCommands: false,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 30000,
  };

  try {
    // Create new connection
    await mongoose.connect(url, options);
    cachedConnection = mongoose.connection;
    
    // Event listeners for connection state
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
      cachedConnection = null;
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      cachedConnection = null;
    });
    
    return mongoose.connection;
  } catch (err) {
    console.error('MongoDB initial connection error:', err);
    cachedConnection = null;
    throw err;
  }
};

module.exports = mongooseConnection;