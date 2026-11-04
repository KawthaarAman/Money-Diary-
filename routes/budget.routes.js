const router = require("express").Router();

const isSignedIn = require("../middleware/is-signed-in");

const Budget = require("../models/Budget");

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

// GET: Show one budget
router.get("/:id", isSignedIn, async (req, res) => {
    const budget = await Budget.findOne({
        _id: req.params.id,
        userId: req.session.user._id
    })

    if (!budget) {
        return res.redirect("/budget")
    }

    res.render("budget/budget-details.ejs", { budget })
})

// DELETE: Delete a budget
router.delete("/:id", isSignedIn, async (req, res) => {
    await Budget.findOneAndDelete({
        _id: req.params.id,
        userId: req.session.user._id
    })

    res.redirect("/budget");
})

module.exports = router;
