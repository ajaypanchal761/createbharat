const mongoose = require('mongoose');

const payoutDetailSchema = new mongoose.Schema(
  {
    ownerType: {
      type: String,
      enum: ['mentor', 'ca'],
      required: true,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    accountHolderName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    bankName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },
    accountNumber: {
      type: String,
      required: true,
      trim: true,
      maxlength: 40,
    },
    ifsc: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      maxlength: 20,
    },
    upiId: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
  }
);

payoutDetailSchema.index({ ownerType: 1, ownerId: 1 }, { unique: true });

module.exports = mongoose.model('PayoutDetail', payoutDetailSchema);

