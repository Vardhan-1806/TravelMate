const mongoose = require('mongoose');

let memoryServerInstance = null;

const connectDB = async () => {
  const uri = process.env.MONGO_URI;

  if (process.env.USE_LOCAL_DB === 'true' || uri === 'local' || uri === 'memory') {
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      memoryServerInstance = await MongoMemoryServer.create({ instance: { launchTimeout: 60000 } });
      const localUri = memoryServerInstance.getUri();
      await mongoose.connect(localUri);
      console.log('Connected to local in-memory MongoDB at:', localUri);
      return;
    } catch (localErr) {
      console.error('Failed to start local MongoDB:', localErr.message);
      process.exit(1);
    }
  }

  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    console.log('MongoDB connected successfully to external database');
  } catch (err) {
    console.warn(`External MongoDB connection failed (${err.message}).`);
    if (process.env.NODE_ENV === 'production') {
      console.error('Refusing to start production without a reachable MongoDB instance.');
      process.exit(1);
    }
    console.log('Falling back to local in-memory database for seamless development...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      memoryServerInstance = await MongoMemoryServer.create({ instance: { launchTimeout: 60000 } });
      const localUri = memoryServerInstance.getUri();
      await mongoose.connect(localUri);
      console.log('Connected to local in-memory MongoDB at:', localUri);
    } catch (fallbackErr) {
      console.error('All MongoDB connection attempts failed:', fallbackErr.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
