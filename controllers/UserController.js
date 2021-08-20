const User = require("../models/user");

module.exports.registerForm = (req, res) => {
    res.render("users/register");
};

module.exports.register = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({
            email,
            username,
        });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) {
                return next(err);
            } else {
                req.flash("success", "Welcome to Yelpcamp");
                res.redirect("/campgrounds");
            }
        });
    } catch (error) {
        req.flash("error", error.message);
        res.redirect("/register");
    }
};

module.exports.loginForm = (req, res) => {
    res.render("users/login");
};

module.exports.login = async (req, res) => {
    req.flash("success", "Welcome Back");
    const redirectUrl = req.session.returnTo || "/campgrounds";
    delete req.session.returnTo;
    return res.redirect(redirectUrl);
};

module.exports.logout = (req, res) => {
    req.logout();
    req.flash("success", "Goodbye");
    return res.redirect("/");
};
