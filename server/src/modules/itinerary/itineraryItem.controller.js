const { createItem, getItemsForTrip, updateItem, deleteItem } = require('./itineraryItem.service');

const create = async (req, res) => {
  try {
    const item = await createItem(req.params.tripId, req.user.id, req.body);
    res.status(201).json({ message: 'Itinerary item added', item });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
  }
};

const getAll = async (req, res) => {
  try {
    const items = await getItemsForTrip(req.params.tripId);
    res.status(200).json({ items });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
  }
};

const update = async (req, res) => {
  try {
    const item = await updateItem(req.params.itemId, req.user.id, req.body);
    res.status(200).json({ message: 'Item updated', item });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
  }
};

const remove = async (req, res) => {
  try {
    await deleteItem(req.params.itemId, req.user.id);
    res.status(200).json({ message: 'Item deleted' });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
  }
};

module.exports = { create, getAll, update, remove };