const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"]
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"]
    },
    type: {
      type: String,
      enum: {
        values: ['income', 'expense'],
        message: 'Type must be income or expense'
      },
      required: [true, "Type is required"]
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Transaction', transactionSchema);