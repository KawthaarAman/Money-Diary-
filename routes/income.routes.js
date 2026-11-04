
const router = require("express").Router();

const isSignedIn = require("../middleware/is-signed-in");

const Income = require("../models/Income");
const Budget = require("../models/Budget");

// GET: Show Create Income page
router.get("/budget/:budgetId/new", isSignedIn, async (req, res) => {
    const budget = await Budget.findOne({
        _id: req.params.budgetId,
        userId: req.session.user._id
    });

    if (!budget) {
        return res.redirect("/budget");
    }

    res.render("income/create-income.ejs", { budget });
});

// POST: Create Income
router.post("/budget/:budgetId", isSignedIn, async (req, res) => {
    const budget = await Budget.findOne({
        _id: req.params.budgetId,
        userId: req.session.user._id
    });

    if (!budget) {
        return res.redirect("/budget");
    }

    await Income.create({
        budgetId: budget._id,
        source: req.body.source,
        amount: req.body.amount,
        date: req.body.date
    });

    res.redirect(`/income/budget/${budget._id}`);
});

// GET: Display all income for a budget
router.get("/budget/:budgetId", isSignedIn, async (req, res) => {
    const budget = await Budget.findOne({
        _id: req.params.budgetId,
        userId: req.session.user._id
    });

    if (!budget) {
        return res.redirect("/budget");
    }

    const incomes = await Income.find({
        budgetId: budget._id
    });

    res.render("income/all-income.ejs", { budget, incomes });
});

// GET: Show Edit Income page
router.get("/:id/edit", isSignedIn, async (req, res) => {
    const income = await Income.findById(req.params.id);

    if (!income) {
        return res.redirect("/budget");
    }

    const budget = await Budget.findOne({
        _id: income.budgetId,
        userId: req.session.user._id
    });

    if (!budget) {
        return res.redirect("/budget");
    }

    res.render("income/edit-income.ejs", { income, budget });
});

// PUT: Update Income
router.put("/:id", isSignedIn, async (req, res) => {
    const income = await Income.findById(req.params.id);

    if (!income) {
        return res.redirect("/budget");
    }

    const budget = await Budget.findOne({
        _id: income.budgetId,
        userId: req.session.user._id
    });

    if (!budget) {
        return res.redirect("/budget");
    }

    await Income.findByIdAndUpdate(req.params.id, {
        source: req.body.source,
        amount: req.body.amount,
        date: req.body.date
    });

    res.redirect(`/income/budget/${budget._id}`);
});

// DELETE: Delete Income
router.delete("/:id", isSignedIn, async (req, res) => {
    const income = await Income.findById(req.params.id);

    if (!income) {
        return res.redirect("/budget");
    }

    const budget = await Budget.findOne({
        _id: income.budgetId,
        userId: req.session.user._id
    });

    if (!budget) {
        return res.redirect("/budget");
    }

    await Income.findByIdAndDelete(req.params.id);

    res.redirect(`/income/budget/${budget._id}`);
});

module.exports = router;
