const router = require("express").Router();

const isSignedIn = require("../middleware/is-signed-in");

const BudgetCategory = require("../models/BudgetCategory");

const Budget = require("../models/Budget");

// GET: Show Create Category page

router.get("/budget/:budgetId/new", isSignedIn, async (req, res) => {
    const budget = await Budget.findOne({
        _id: req.params.budgetId,
        userId: req.session.user._id
    })

    if (!budget) {
        return res.redirect("/budget")
    }

    res.render("budget-category/create-category.ejs", { budget })
})

// POST: Create Category

router.post("/budget/:budgetId", isSignedIn, async (req, res) => {
    const budget = await Budget.findOne({
        _id: req.params.budgetId,
        userId: req.session.user._id
    })

    if (!budget) {
        return res.redirect("/budget")
    }

    await BudgetCategory.create({
        budgetId: budget._id,
        name: req.body.name,
        allocatedAmount: req.body.allocatedAmount
    })

    res.redirect(`/budget-category/budget/${budget._id}`);
})

// GET: Display all categories for a budget

router.get("/budget/:budgetId", isSignedIn, async (req, res) => {
    const budget = await Budget.findOne({
        _id: req.params.budgetId,
        userId: req.session.user._id
    })

    if (!budget) {
        return res.redirect("/budget")
    }

    const categories = await BudgetCategory.find({
        budgetId: budget._id
    })

    const totalAllocated = categories.reduce(
        (total, category) => total + category.allocatedAmount,
        0
    )

    res.render("budget-category/all-categories.ejs", {
        budget,
        categories,
        totalAllocated
    })
})

// GET: Show Edit Category page

router.get("/:id/edit", isSignedIn, async (req, res) => {
    const category = await BudgetCategory.findById(req.params.id)

    if (!category) {
        return res.redirect("/budget")
    }

    const budget = await Budget.findOne({
        _id: category.budgetId,
        userId: req.session.user._id
    })

    if (!budget) {
        return res.redirect("/budget")
    }

    res.render("budget-category/edit-category.ejs", {
        budget,
        category
    })
})

// PUT: Update Category

router.put("/:id", isSignedIn, async (req, res) => {
    const category = await BudgetCategory.findById(req.params.id)

    if (!category) {
        return res.redirect("/budget")
    }

    const budget = await Budget.findOne({
        _id: category.budgetId,
        userId: req.session.user._id
    })

    if (!budget) {
        return res.redirect("/budget")
    }

    await BudgetCategory.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        allocatedAmount: req.body.allocatedAmount
    })

    res.redirect(`/budget-category/budget/${budget._id}`);
})

// DELETE: Delete Category

router.delete("/:id", isSignedIn, async (req, res) => {
    const category = await BudgetCategory.findById(req.params.id);

    if (!category) {
        return res.redirect("/budget")
    }

    const budget = await Budget.findOne({
        _id: category.budgetId,
        userId: req.session.user._id
    })

    if (!budget) {
        return res.redirect("/budget")
    }

    await BudgetCategory.findByIdAndDelete(req.params.id)

    res.redirect(`/budget-category/budget/${budget._id}`)
})

module.exports = router;
