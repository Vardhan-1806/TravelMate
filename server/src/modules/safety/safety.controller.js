const { createReport, blockUser, unblockUser } = require('./safety.service');

const report = async (req, res) => {
  try {
    const result = await createReport(req.user.id, req.body);
    res.status(201).json({ message: 'Report submitted', report: result });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
  }
};

const block = async (req, res) => {
  try {
    const result = await blockUser(req.user.id, req.params.userId);
    res.status(201).json({ message: 'User blocked', block: result });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
  }
};

const unblock = async (req, res) => {
  try {
    await unblockUser(req.user.id, req.params.userId);
    res.status(200).json({ message: 'User unblocked' });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
  }
};

module.exports = { report, block, unblock };