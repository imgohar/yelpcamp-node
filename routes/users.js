const express = require("express");
const router = express.Router();
const catchAsync = require("../utlis/catchAsync");
const passport = require("passport");
const UserController = require("../controllers/UserController");

router.get("/register", UserController.registerForm);

router.post("/register", catchAsync(UserController.register));

router.get("/login", UserController.loginForm);

router.post(
    "/login",
    passport.authenticate("local", {
        failureFlash: true,
        failureRedirect: "/login",
    }),
    UserController.login
);

router.get("/logout", UserController.logout);

module.exports = router;
