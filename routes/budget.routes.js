const router = require("express").Router();

const isSignedIn = require("../middleware/is-signed-in");

const Budget = require("../models/Budget");

const Income = require("../models/Income");

const Obligation = require("../models/Obligation");

const BudgetCategory = require("../models/BudgetCategory");

const Transaction = require("../models/Transaction")

const SavingsGoals = require("../models/SavingsGoals");

// GET: Show Create Budget page

router.get("/new", isSignedIn, (req, res) => {
    res.render("budget/create-budget.ejs")
})

// POST: Create a new budget

router.post("/", isSignedIn, async (req, res) => {
    const newBudget = await Budget.create({
        userId: req.session.user._id,
        month: req.body.month,
        year: req.body.year
    })

    res.redirect(`/budget`)
})

// GET: Display all budgets

router.get("/", isSignedIn, async (req, res) => {
    const budgets = await Budget.find({
        userId: req.session.user._id
    })

    res.render("budget/all-budgets.ejs", { budgets })
})

// GET: Show Edit Budget page

router.get("/:id/edit", isSignedIn, async (req, res) => {
    const budget = await Budget.findOne({
        _id: req.params.id,
        userId: req.session.user._id
    })

    if (!budget) {
        return res.redirect("/budget")
    }

    res.render("budget/edit-budget.ejs", { budget })
})

// PUT: Update Budget

router.put("/:id", isSignedIn, async (req, res) => {
    await Budget.findOneAndUpdate(
        {
            _id: req.params.id,
            userId: req.session.user._id
        },
        {
            month: req.body.month,
            year: req.body.year
        }
    )

    res.redirect("/budget")
})

// GET: Show Budget Details

router.get("/:id", isSignedIn, async (req, res) => {

    const budget = await Budget.findOne({
        _id: req.params.id,
        userId: req.session.user._id
    })

    if (!budget) {
        return res.redirect("/budget")
    }

    const incomes = await Income.find({ budgetId: budget._id });

    const obligations = await Obligation.find({ budgetId: budget._id });

    const categories = await BudgetCategory.find({ budgetId: budget._id });

    const transactions = await Transaction.find({ budgetId: budget._id });

    const savingsGoals = await SavingsGoals.find({ budgetId: budget._id });

    const totalIncome = incomes.reduce((total, income) => total + income.amount, 0);

    const totalObligations = obligations.reduce((total, obligation) => total + obligation.amount, 0);

    const remainingBalance = totalIncome - totalObligations;

    res.render("budget/budget-details.ejs", {
        budget,
        incomes,
        obligations,
        categories,
        transactions,
        savingsGoals,
        totalIncome,
        totalObligations,
        remainingBalance
    });
});

// DELETE: Delete a budget

router.delete("/:id", isSignedIn, async (req, res) => {
    await Budget.findOneAndDelete({
        _id: req.params.id,
        userId: req.session.user._id
    })

    res.redirect("/budget")
})

module.exports = router;
