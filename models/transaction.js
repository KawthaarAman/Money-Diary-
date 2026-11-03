const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  budgetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Budget",
    required: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "BudgetCategory",
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  photo: {
    type: String
  },
  mood: {
    type: String
  },
  note: {
    type: String,
    trim: true
  }
}, { timestamps: true });

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;