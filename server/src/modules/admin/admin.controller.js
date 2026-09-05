const { getDashboardStats, getAllReports, resolveReport, suspendUser } = require('./admin.service');

const stats = async (req, res) => {
  try {
    const data = await getDashboardStats();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const reports = async (req, res) => {
  try {
    const data = await getAllReports(req.query.status);
    res.status(200).json({ reports: data });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateReport = async (req, res) => {
  try {
    const report = await resolveReport(req.params.reportId, req.body.status);
    res.status(200).json({ message: 'Report updated', report });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
  }
};

const updateSuspension = async (req, res) => {
  try {
    const user = await suspendUser(req.params.userId, req.body.suspend);
    res.status(200).json({ message: 'User updated', user });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
  }
};

module.exports = { stats, reports, updateReport, updateSuspension };