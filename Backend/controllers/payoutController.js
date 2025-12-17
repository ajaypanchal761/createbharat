const PayoutDetail = require('../models/payoutDetail');
const Admin = require('../models/admin');
const { createNotification } = require('./notificationController');

const sanitizePayload = (body) => ({
  accountHolderName: body.accountHolderName,
  bankName: body.bankName,
  accountNumber: body.accountNumber,
  ifsc: body.ifsc,
  upiId: body.upiId,
  notes: body.notes,
});

const upsertForOwner = async (ownerType, ownerId, body) => {
  const payload = sanitizePayload(body);
  const doc = await PayoutDetail.findOneAndUpdate(
    { ownerType, ownerId },
    { ownerType, ownerId, ...payload },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  return doc;
};

// Mentor endpoints
const saveMentorPayout = async (req, res) => {
  try {
    const mentorId = req.mentor?.id;
    if (!mentorId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const required = ['accountHolderName', 'bankName', 'accountNumber', 'ifsc'];
    for (const field of required) {
      if (!req.body[field]) {
        return res.status(400).json({ success: false, message: `${field} is required` });
      }
    }

    const doc = await upsertForOwner('mentor', mentorId, req.body);
    res.status(200).json({ success: true, data: doc });
  } catch (error) {
    console.error('saveMentorPayout error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getMentorPayout = async (req, res) => {
  try {
    const mentorId = req.mentor?.id;
    if (!mentorId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const doc = await PayoutDetail.findOne({ ownerType: 'mentor', ownerId: mentorId });
    res.status(200).json({ success: true, data: doc || null });
  } catch (error) {
    console.error('getMentorPayout error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// CA endpoints
const saveCAPayout = async (req, res) => {
  try {
    const caId = req.ca?.id;
    if (!caId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const required = ['accountHolderName', 'bankName', 'accountNumber', 'ifsc'];
    for (const field of required) {
      if (!req.body[field]) {
        return res.status(400).json({ success: false, message: `${field} is required` });
      }
    }

    const doc = await upsertForOwner('ca', caId, req.body);
    res.status(200).json({ success: true, data: doc });
  } catch (error) {
    console.error('saveCAPayout error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getCAPayout = async (req, res) => {
  try {
    const caId = req.ca?.id;
    if (!caId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const doc = await PayoutDetail.findOne({ ownerType: 'ca', ownerId: caId });
    res.status(200).json({ success: true, data: doc || null });
  } catch (error) {
    console.error('getCAPayout error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Admin endpoints
const listPayouts = async (req, res) => {
  try {
    const { ownerType, search } = req.query;
    const query = {};
    if (ownerType) query.ownerType = ownerType;
    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [
        { accountHolderName: regex },
        { bankName: regex },
        { accountNumber: regex },
        { ifsc: regex },
        { upiId: regex },
        { notes: regex },
      ];
    }
    const docs = await PayoutDetail.find(query).sort({ updatedAt: -1 }).lean();
    res.status(200).json({ success: true, count: docs.length, data: docs });
  } catch (error) {
    console.error('listPayouts error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

const getPayoutById = async (req, res) => {
  try {
    const doc = await PayoutDetail.findById(req.params.id);
    if (!doc) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }
    res.status(200).json({ success: true, data: doc });
  } catch (error) {
    console.error('getPayoutById error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  saveMentorPayout,
  getMentorPayout,
  saveCAPayout,
  getCAPayout,
  listPayouts,
  getPayoutById,
};

