const express = require("express");

const router = express.Router();

const multer = require("multer");

const path = require("path");

const isSignedIn = require("../middleware/is-signed-in");


const Transaction = require("../models/Transaction");

const Budget = require("../models/Budget");

const BudgetCategory = require("../models/BudgetCategory");

// Multer Setup

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/transactions/");
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


// GET: Show Create Transaction Page

router.get("/budget/:budgetId/new", isSignedIn, async (req, res) => {
    const budget = await Budget.findOne({
        _id: req.params.budgetId,
        userId: req.session.user._id
    });

    if (!budget) {
        return res.send("Budget not found.");
    }

    const categories = await BudgetCategory.find({
        budgetId: budget._id
    });

    res.render("transaction/create-transaction.ejs", {
        budget,
        categories
    });
});


// POST: Create Transaction

router.post(
    "/budget/:budgetId",
    isSignedIn,
    upload.single("photo"),
    async (req, res) => {

        const budget = await Budget.findOne({
            _id: req.params.budgetId,
            userId: req.session.user._id
        });

        if (!budget) {
            return res.send("Budget not found.");
        }

        const category = await BudgetCategory.findOne({
            _id: req.body.categoryId,
            budgetId: budget._id
        });

        if (!category) {
            return res.send("Please select a valid category.");
        }

        await Transaction.create({
            budgetId: budget._id,
            categoryId: category._id,
            title: req.body.title,
            amount: req.body.amount,
            date: req.body.date,
            photo: req.file
                ? `/uploads/transactions/${req.file.filename}`
                : "",
            mood: req.body.mood,
            note: req.body.note
        });

        res.redirect(`/transaction/budget/${budget._id}`);
    }
);


// GET: Show All Transactions for a Budget

router.get("/budget/:budgetId", isSignedIn, async (req, res) => {
    const budget = await Budget.findOne({
        _id: req.params.budgetId,
        userId: req.session.user._id
    });

    if (!budget) {
        return res.send("Budget not found.");
    }

    const transactions = await Transaction.find({
        budgetId: budget._id
    }).populate("categoryId");

    const totalSpending = transactions.reduce((total, transaction) => {
        return total + transaction.amount;
    }, 0);

    res.render("transaction/all-transactions.ejs", {
        budget,
        transactions,
        totalSpending
    });
});


// GET: Show Edit Transaction Page

router.get("/:id/edit", isSignedIn, async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
        return res.send("Transaction not found.");
    }

    const budget = await Budget.findOne({
        _id: transaction.budgetId,
        userId: req.session.user._id
    });

    if (!budget) {
        return res.send("Budget not found.");
    }

    const categories = await BudgetCategory.find({
        budgetId: budget._id
    });

    res.render("transaction/edit-transaction.ejs", {
        transaction,
        budget,
        categories
    });
});


// PUT: Update Transaction

router.put(
    "/:id",
    isSignedIn,
    upload.single("photo"),
    async (req, res) => {

        const transaction = await Transaction.findById(req.params.id);

        if (!transaction) {
            return res.send("Transaction not found.");
        }

        const budget = await Budget.findOne({
            _id: transaction.budgetId,
            userId: req.session.user._id
        });

        if (!budget) {
            return res.send("Budget not found.");
        }

        const category = await BudgetCategory.findOne({
            _id: req.body.categoryId,
            budgetId: budget._id
        });

        if (!category) {
            return res.send("Please select a valid category.");
        }

        await Transaction.findByIdAndUpdate(req.params.id, {
            categoryId: category._id,
            title: req.body.title,
            amount: req.body.amount,
            date: req.body.date,
            photo: req.file
                ? `/uploads/transactions/${req.file.filename}`
                : transaction.photo,
            mood: req.body.mood,
            note: req.body.note
        });

        res.redirect(`/transaction/budget/${budget._id}`);
    }
);


// DELETE: Delete Transaction

router.delete("/:id", isSignedIn, async (req, res) => {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
        return res.send("Transaction not found.");
    }

    const budget = await Budget.findOne({
        _id: transaction.budgetId,
        userId: req.session.user._id
    });

    if (!budget) {
        return res.send("Budget not found.");
    }

    await Transaction.findByIdAndDelete(req.params.id);

    res.redirect(`/transaction/budget/${budget._id}`);
});


module.exports = router;
