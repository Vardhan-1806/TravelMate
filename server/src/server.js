require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const connectDB = require('./config/db');
const initializeSocket = require('./socket');

const PORT = process.env.PORT || 5000;

const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map((origin) => origin.trim()),
    credentials: true,
  },
});

initializeSocket(io);

const start = async () => {
  await connectDB();
  httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
};

const shutdown = async (signal) => {
  console.log(`${signal} received. Shutting down gracefully...`);
  io.close();
  httpServer.close(async () => {
    const mongoose = require('mongoose');
    await mongoose.connection.close(false);
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

start().catch((error) => {
  console.error('Server failed to start:', error);
  process.exit(1);
});
