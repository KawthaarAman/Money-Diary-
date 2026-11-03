const mongoose = require("mongoose");

const obligationSchema = new mongoose.Schema({
  budgetId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Budget",
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  dueDate: {
    type: Date,
    required: true
  },
  isPaid: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const Obligation = mongoose.model("Obligation", obligationSchema);

module.exports = Obligation;