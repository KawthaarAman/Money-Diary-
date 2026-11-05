const express = require("express");

const router = express.Router();

const multer = require("multer");

const path = require("path");

const isSignedIn = require("../middleware/is-signed-in");

const SavingsGoal = require("../models/SavingsGoals");

const Budget = require("../models/Budget");

// MULTER SETUP

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/savings-goals/");
    },

    filename: (req, file, cb) => {
        const uniqueName = Date.now() + "-" + Math.round(Math.random() * 1E9);
        cb(null, uniqueName + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed."));
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

// GET: Create Savings Goal Page

router.get("/budget/:budgetId/new", isSignedIn, async (req, res) => {
    const budget = await Budget.findById(req.params.budgetId);

    res.render("savings-goal/create-goal.ejs", {
        budget
    });
});

// POST: Create Savings Goal

router.post("/budget/:budgetId", isSignedIn, upload.single("photo"), async (req, res) => {
    await SavingsGoal.create({
        budgetId: req.params.budgetId,
        name: req.body.name,
        targetAmount: req.body.targetAmount,
        savedAmount: req.body.savedAmount || 0,
        deadline: req.body.deadline || undefined,

        photo: req.file
            ? `/uploads/savings-goals/${req.file.filename}`
            : ""
    });

    res.redirect(`/savings-goal/budget/${req.params.budgetId}`);
});

// GET: All Savings Goals

router.get("/budget/:budgetId", isSignedIn, async (req, res) => {
    const budget = await Budget.findById(req.params.budgetId);

    const savingsGoals = await SavingsGoal.find({
        budgetId: req.params.budgetId
    });

    res.render("savings-goal/all-goals.ejs", {
        budget,
        savingsGoals
    });
});

// GET: Edit Savings Goal Page

router.get("/:id/edit", isSignedIn, async (req, res) => {
    const savingsGoal = await SavingsGoal.findById(req.params.id);

    const budget = await Budget.findById(savingsGoal.budgetId);

    res.render("savings-goal/edit-goal.ejs", {
        savingsGoal,
        budget
    });
});

// PUT: Update Savings Goal

router.put("/:id", isSignedIn, upload.single("photo"), async (req, res) => {
    const savingsGoal = await SavingsGoal.findById(req.params.id);

    await SavingsGoal.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        targetAmount: req.body.targetAmount,
        savedAmount: req.body.savedAmount || 0,
        deadline: req.body.deadline || undefined,

        photo: req.file
            ? `/uploads/savings-goals/${req.file.filename}`
            : savingsGoal.photo
    });

    res.redirect(`/savings-goal/budget/${savingsGoal.budgetId}`);
});

// DELETE: Savings Goal

router.delete("/:id", isSignedIn, async (req, res) => {
    const savingsGoal = await SavingsGoal.findById(req.params.id);

    await SavingsGoal.findByIdAndDelete(req.params.id);

    res.redirect(`/savings-goal/budget/${savingsGoal.budgetId}`);
});

module.exports = router;