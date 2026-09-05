const { generateForTrip, getChecklist, togglePacked, addCustomItem, removeItem } = require('./preparation.service');

const generate = async (req, res) => {
  try {
    const items = await generateForTrip(req.params.tripId, req.user.id);
    res.status(201).json({ message: 'Checklist generated', items });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
  }
};

const getAll = async (req, res) => {
  try {
    const items = await getChecklist(req.params.tripId, req.user.id);
    res.status(200).json({ items });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
  }
};

const toggle = async (req, res) => {
  try {
    const item = await togglePacked(req.params.itemId, req.user.id);
    res.status(200).json({ item });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
  }
};

const addCustom = async (req, res) => {
  try {
    const item = await addCustomItem(req.params.tripId, req.user.id, req.body);
    res.status(201).json({ item });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
  }
};

const remove = async (req, res) => {
  try {
    await removeItem(req.params.itemId, req.user.id);
    res.status(200).json({ message: 'Item removed' });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
  }
};

module.exports = { generate, getAll, toggle, addCustom, remove };