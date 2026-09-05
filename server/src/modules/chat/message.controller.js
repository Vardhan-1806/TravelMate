const Message = require('./message.model');

const getHistory = async (req, res) => {
  try {
    const { tripId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 30;
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      Message.find({ trip: tripId })
        .populate('sender', 'name')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Message.countDocuments({ trip: tripId }),
    ]);

    res.status(200).json({
      messages: messages.reverse(),
      pagination: { total, page, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getHistory };