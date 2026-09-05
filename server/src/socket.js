const { isBlockedEitherWay } = require('./modules/safety/safety.service');
const jwt = require('jsonwebtoken');
const TripMember = require('./modules/trips/tripMember.model');
const Message = require('./modules/chat/message.model');


const initializeSocket = (io) => {
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
      socket.userId = decoded.id;
      next();
    } catch (err) {
      next(new Error('Invalid or expired token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}, user: ${socket.userId}`);

    socket.on('join-trip-room', async (tripId) => {
      const isMember = await TripMember.findOne({ trip: tripId, user: socket.userId });
      if (!isMember) {
        socket.emit('error', { message: 'You are not a member of this trip' });
        return;
      }
      socket.join(`trip:${tripId}`);
      socket.emit('joined-room', { tripId });
    });

    socket.on('send-message', async ({ tripId, content }) => {
      const isMember = await TripMember.findOne({ trip: tripId, user: socket.userId });
      if (!isMember) {
        socket.emit('error', { message: 'You are not a member of this trip' });
        return;
      }

      const message = await Message.create({
        trip: tripId,
        sender: socket.userId,
        content,
      });
      await message.populate('sender', 'name');

      io.to(`trip:${tripId}`).emit('new-message', message);
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};

module.exports = initializeSocket;