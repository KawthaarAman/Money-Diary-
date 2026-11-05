const mongoose = require("mongoose");

const savingsGoalSchema = new mongoose.Schema({
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
  targetAmount: {
    type: Number,
    required: true,
    min: 0
  },
  savedAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  photo: {
    type: String,
    default: ""
  },
  deadline: {
    type: Date
  }
}, { timestamps: true });

const SavingsGoal = mongoose.model("SavingsGoal", savingsGoalSchema);

module.exports = SavingsGoal;