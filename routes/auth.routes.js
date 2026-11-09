const express = require("express");

const router = express.Router();

const User = require("../models/User.js");

const bcrypt = require("bcrypt");

router.get("/sign-up", (req, res) => {
    res.render("auth/sign-up.ejs");
});

router.post("/sign-up", async (req, res) => {

    const { username, password, confirmPassword } = req.body;

    if (password.length < 7) {
        return res.send("Password must be at least 7 characters.");
    }

    if (password !== confirmPassword) {
        return res.send("Password and Confirm Password must match.");
    }

    const userInDatabase = await User.findOne({ username });

    if (userInDatabase) {
        return res.send("Username already taken.");
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    await User.create({
        username,
        password: hashedPassword
    });

    res.redirect("/auth/sign-in");
});

router.get("/sign-in", (req, res) => {
    res.render("auth/sign-in.ejs");
});

router.post("/sign-in", async (req, res) => {

    const userInDatabase = await User.findOne({
        username: req.body.username
    });

    if (!userInDatabase) {
        return res.send("Login failed. Please try again.");
    }

    const validPassword = bcrypt.compareSync(
        req.body.password,
        userInDatabase.password
    );

    if (!validPassword) {
        return res.send("Login failed. Please try again.");
    }

    req.session.user = {
        username: userInDatabase.username,
        _id: userInDatabase._id
    };

    res.redirect("/");
});

router.get("/sign-out", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
});

module.exports = router;