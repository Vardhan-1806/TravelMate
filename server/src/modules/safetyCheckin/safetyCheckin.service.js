const TrustedContact = require('./trustedContact.model');
const TripShare = require('./tripShare.model');
const CheckIn = require('./checkIn.model');
const { createNotification } = require('../notifications/notification.service');

const addTrustedContact = async (userId, { contactName, contactPhone, contactEmail }) => {
  return TrustedContact.create({ user: userId, contactName, contactPhone, contactEmail });
};

const getMyContacts = async (userId) => {
  return TrustedContact.find({ user: userId });
};

const shareTrip = async (userId, tripId, trustedContactId) => {
  const contact = await TrustedContact.findOne({ _id: trustedContactId, user: userId });
  if (!contact) {
    const error = new Error('Trusted contact not found');
    error.statusCode = 404;
    throw error;
  }

  try {
    return await TripShare.create({ trip: tripId, user: userId, trustedContact: trustedContactId });
  } catch (err) {
    if (err.code === 11000) {
      const error = new Error('Trip already shared with this contact');
      error.statusCode = 409;
      throw error;
    }
    throw err;
  }
};

const scheduleCheckIn = async (userId, tripId, scheduledFor) => {
  return CheckIn.create({ user: userId, trip: tripId, scheduledFor });
};

const confirmCheckIn = async (checkInId, userId) => {
  const checkIn = await CheckIn.findOneAndUpdate(
    { _id: checkInId, user: userId, status: 'PENDING' },
    { $set: { checkedInAt: new Date(), status: 'CONFIRMED' } },
    { new: true }
  );
  if (!checkIn) {
    const error = new Error('Check-in not found or already completed');
    error.statusCode = 404;
    throw error;
  }
  return checkIn;
};

const processMissedCheckIns = async () => {
  const overdue = await CheckIn.find({
    status: 'PENDING',
    scheduledFor: { $lt: new Date() },
  }).populate('trip', 'title');

  for (const checkIn of overdue) {
    checkIn.status = 'MISSED';
    await checkIn.save();

    await createNotification({
      userId: checkIn.user,
      type: 'CHECKIN_MISSED',
      message: `You missed a safety check-in for "${checkIn.trip.title}". Please confirm you're safe.`,
      relatedTrip: checkIn.trip._id,
    });
  }

  return { processedCount: overdue.length };
};

module.exports = { addTrustedContact, getMyContacts, shareTrip, scheduleCheckIn, confirmCheckIn, processMissedCheckIns };