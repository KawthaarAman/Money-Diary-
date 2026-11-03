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

    res.redirect(`/budget/${newBudget._id}`)
})

module.exports = router;
