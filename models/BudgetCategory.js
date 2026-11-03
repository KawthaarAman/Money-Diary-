const mongoose = require("mongoose");

const budgetCategorySchema = new mongoose.Schema({
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
  allocatedAmount: {
    type: Number,
    required: true,
    min: 0
  }
}, { timestamps: true });

const BudgetCategory = mongoose.model("BudgetCategory", budgetCategorySchema);

module.exports = BudgetCategory;