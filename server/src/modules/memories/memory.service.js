const cloudinary = require('../../config/cloudinary');
const Memory = require('./memory.model');
const Trip = require('../trips/trip.model');
const ItineraryItem = require('../itinerary/itineraryItem.model');
const Expense = require('../expenses/expense.model');
const Review = require('../reviews/review.model');
const TripMember = require('../trips/tripMember.model');

const uploadPhoto = async (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'travelmate-memories' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(fileBuffer);
  });
};

const createOrUpdateMemory = async (tripId, userId, { caption, photoUrls }) => {
  const trip = await Trip.findById(tripId);
  if (!trip || trip.status !== 'COMPLETED') {
    const error = new Error('Memories can only be created for completed trips');
    error.statusCode = 400;
    throw error;
  }

  const memory = await Memory.findOneAndUpdate(
    { trip: tripId },
    {
      $set: { caption },
      $setOnInsert: { createdBy: userId },
      $push: { photos: { $each: photoUrls || [] } },
    },
    { new: true, upsert: true, runValidators: true }
  );

  return memory;
};

const getFullMemory = async (tripId) => {
  const [memory, trip, itinerary, expenses, reviews, members] = await Promise.all([
    Memory.findOne({ trip: tripId }),
    Trip.findById(tripId),
    ItineraryItem.find({ trip: tripId }).sort({ date: 1 }),
    Expense.find({ trip: tripId }),
    Review.find({ trip: tripId }).populate('reviewer', 'name').populate('reviewee', 'name'),
    TripMember.find({ trip: tripId }).populate('user', 'name'),
  ]);

  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

  return {
    memory: memory || { photos: [], caption: '' },
    trip: { title: trip.title, destination: trip.destination, startDate: trip.startDate, endDate: trip.endDate },
    stats: {
      totalMembers: members.length,
      totalExpenses: expenses.length,
      totalSpent,
      totalItineraryItems: itinerary.length,
      totalReviews: reviews.length,
    },
    itinerary,
    reviews,
    members: members.map((m) => m.user),
  };
};

module.exports = { uploadPhoto, createOrUpdateMemory, getFullMemory };