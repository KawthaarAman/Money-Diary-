const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: true
  }
}, { timestamps: true });

/* to prevent the same user from creating more than one budget for the same month and year.

{ userId: 1, month: 1, year: 1 }

These are the fields included in the index: 
- userId: 1 → Sorts the index in ascending order by user ID.
- month: 1 → Then by month.
- year: 1 → Then by year.
*/

budgetSchema.index(
  { userId: 1, month: 1, year: 1 },
  { unique: true }
);

const Budget = mongoose.model("Budget", budgetSchema);

module.exports = Budget;