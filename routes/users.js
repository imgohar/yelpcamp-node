const express = require("express");
const router = express.Router();
const catchAsync = require("../utlis/catchAsync");
const passport = require("passport");
const UserController = require("../controllers/UserController");

router
    .route("/register")
    .get(UserController.registerForm)
    .post(catchAsync(UserController.register));

router
    .route("/login")
    .get(UserController.loginForm)
    .post(
        passport.authenticate("local", {
            failureFlash: true,
            failureRedirect: "/login",
        }),
        UserController.login
    );

router.get("/logout", UserController.logout);

module.exports = router;
