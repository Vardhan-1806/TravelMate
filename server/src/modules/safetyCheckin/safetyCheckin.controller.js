const {
  addTrustedContact, getMyContacts, shareTrip,
  scheduleCheckIn, confirmCheckIn, processMissedCheckIns,
} = require('./safetyCheckin.service');

const addContact = async (req, res) => {
  try {
    const contact = await addTrustedContact(req.user.id, req.body);
    res.status(201).json({ contact });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
  }
};

const listContacts = async (req, res) => {
  try {
    const contacts = await getMyContacts(req.user.id);
    res.status(200).json({ contacts });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const share = async (req, res) => {
  try {
    const result = await shareTrip(req.user.id, req.params.tripId, req.body.trustedContactId);
    res.status(201).json({ message: 'Trip shared', share: result });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
  }
};

const createCheckIn = async (req, res) => {
  try {
    const checkIn = await scheduleCheckIn(req.user.id, req.params.tripId, req.body.scheduledFor);
    res.status(201).json({ checkIn });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const confirm = async (req, res) => {
  try {
    const checkIn = await confirmCheckIn(req.params.checkInId, req.user.id);
    res.status(200).json({ message: "Confirmed - you're marked safe", checkIn });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message || 'Server error' });
  }
};

const runMissedCheck = async (req, res) => {
  try {
    const result = await processMissedCheckIns();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { addContact, listContacts, share, createCheckIn, confirm, runMissedCheck };