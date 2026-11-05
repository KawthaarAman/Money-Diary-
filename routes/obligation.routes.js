const router = require("express").Router();

const isSignedIn = require("../middleware/is-signed-in");

const Obligation = require("../models/Obligation");

const Budget = require("../models/Budget");

// GET: Show Create Obligation page

router.get("/budget/:budgetId/new", isSignedIn, async (req, res) => {
    const budget = await Budget.findOne({
        _id: req.params.budgetId,
        userId: req.session.user._id
    })

    if (!budget) {
        return res.redirect("/budget")
    }

    res.render("obligation/create-obligation.ejs", { budget })
})

// POST: Create Obligation

router.post("/budget/:budgetId", isSignedIn, async (req, res) => {
    const budget = await Budget.findOne({
        _id: req.params.budgetId,
        userId: req.session.user._id
    })

    if (!budget) {
        return res.redirect("/budget");
    }

    await Obligation.create({
        budgetId: budget._id,
        name: req.body.name,
        amount: req.body.amount,
        dueDate: req.body.dueDate
    })

    res.redirect(`/obligation/budget/${budget._id}`);
});

// GET: Display all obligations for a budget

router.get("/budget/:budgetId", isSignedIn, async (req, res) => {
    const budget = await Budget.findOne({
        _id: req.params.budgetId,
        userId: req.session.user._id
    })

    if (!budget) {
        return res.redirect("/budget")
    }

    const obligations = await Obligation.find({
        budgetId: budget._id
    })

    res.render("obligation/all-obligations.ejs", {
        budget,
        obligations
    });
});

// GET: Show Edit Obligation page

router.get("/:id/edit", isSignedIn, async (req, res) => {
    const obligation = await Obligation.findById(req.params.id)

    if (!obligation) {
        return res.redirect("/budget")
    }

    const budget = await Budget.findOne({
        _id: obligation.budgetId,
        userId: req.session.user._id
    })

    if (!budget) {
        return res.redirect("/budget");
    }

    res.render("obligation/edit-obligation.ejs", {
        budget,
        obligation
    })
})

// PUT: Update Obligation

router.put("/:id", isSignedIn, async (req, res) => {
    const obligation = await Obligation.findById(req.params.id);

    if (!obligation) {
        return res.redirect("/budget");
    }

    const budget = await Budget.findOne({
        _id: obligation.budgetId,
        userId: req.session.user._id
    })

    if (!budget) {
        return res.redirect("/budget");
    }

    await Obligation.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        amount: req.body.amount,
        dueDate: req.body.dueDate
    });

    res.redirect(`/obligation/budget/${budget._id}`);
});

// PUT: Mark Obligation as Paid or Unpaid

router.put("/:id/status", isSignedIn, async (req, res) => {
    const obligation = await Obligation.findById(req.params.id);

    if (!obligation) {
        return res.redirect("/budget");
    }

    const budget = await Budget.findOne({
        _id: obligation.budgetId,
        userId: req.session.user._id
    });

    if (!budget) {
        return res.redirect("/budget");
    }

    await Obligation.findByIdAndUpdate(req.params.id, {
        isPaid: !obligation.isPaid
    });

    res.redirect(`/obligation/budget/${budget._id}`);
});

// DELETE: Delete Obligation

router.delete("/:id", isSignedIn, async (req, res) => {
    const obligation = await Obligation.findById(req.params.id);

    if (!obligation) {
        return res.redirect("/budget");
    }

    const budget = await Budget.findOne({
        _id: obligation.budgetId,
        userId: req.session.user._id
    });

    if (!budget) {
        return res.redirect("/budget");
    }

    await Obligation.findByIdAndDelete(req.params.id);

    res.redirect(`/obligation/budget/${budget._id}`);
});

module.exports = router;
