const express = require("express");
const router = express.Router();
const catchAsync = require("../utlis/catchAsync");
const { userSchema } = require("../schemas");
const passport = require("passport");
const ExpressError = require("../utlis/ExpressError");
const User = require("../models/user");

router.get("/register", (req, res) => {
    res.render("users/register");
});

router.post(
    "/register",
    catchAsync(async (req, res) => {
        try {
            const { email, username, password } = req.body;
            const user = new User({
                email,
                username,
            });
            const registeredUser = await User.register(user, password);
            req.flash("success", "Welcome to Yelpcamp");
            res.redirect("/campgrounds");
        } catch (error) {
            req.flash("error", error.message);
            res.redirect("/register");
        }
    })
);

router.get("/login", (req, res) => {
    res.render("users/login");
});

router.post(
    "/login",
    passport.authenticate("local", {
        failureFlash: true,
        failureRedirect: "/login",
    }),
    async (req, res) => {
        req.flash("success", "Welcome Back");
        res.redirect("/campgrounds");
    }
);

module.exports = router;
