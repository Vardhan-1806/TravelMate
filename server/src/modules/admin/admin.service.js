const User = require('../auth/user.model');
const Trip = require('../trips/trip.model');
const Report = require('../safety/report.model');

const getDashboardStats = async () => {
  const [totalUsers, totalTrips, openTrips, pendingReports] = await Promise.all([
    User.countDocuments(),
    Trip.countDocuments(),
    Trip.countDocuments({ status: 'OPEN' }),
    Report.countDocuments({ status: 'PENDING' }),
  ]);

  return { totalUsers, totalTrips, openTrips, pendingReports };
};

const getAllReports = async (statusFilter) => {
  const query = statusFilter ? { status: statusFilter } : {};
  return Report.find(query)
    .populate('reporter', 'name email')
    .populate('reportedUser', 'name email')
    .populate('reportedTrip', 'title')
    .sort({ createdAt: -1 });
};

const resolveReport = async (reportId, newStatus) => {
  const report = await Report.findByIdAndUpdate(
    reportId,
    { $set: { status: newStatus } },
    { new: true }
  );
  if (!report) {
    const error = new Error('Report not found');
    error.statusCode = 404;
    throw error;
  }
  return report;
};

const suspendUser = async (userId, suspend) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: { isSuspended: suspend } },
    { new: true }
  ).select('-password');
  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 404;
    throw error;
  }
  return user;
};

module.exports = { getDashboardStats, getAllReports, resolveReport, suspendUser };