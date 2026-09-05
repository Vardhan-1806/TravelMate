const { uploadPhoto, createOrUpdateMemory, getFullMemory } = require('./memory.service');

const create = async (req, res) => {
  try {
    let photoUrls = [];
    if (req.files && req.files.length > 0) {
      photoUrls = await Promise.all(req.files.map((file) => uploadPhoto(file.buffer)));
    }
    const memory = await createOrUpdateMemory(req.params.tripId, req.user.id, {
      caption: req.body.caption,
      photoUrls,
    });
    res.status(200).json({ message: 'Memory saved', memory });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
  }
};

const getOne = async (req, res) => {
  try {
    const result = await getFullMemory(req.params.tripId);
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { create, getOne };