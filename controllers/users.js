const passportLocalMongoose = require("passport-local-mongoose");
const User = require("../models/user");

module.exports.SignUp = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err) => {
            if (err) {
                console.error("Login error:", err);
                return next(err);
            }
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });
    } catch (e) {
        console.error("Signup error:", e);
        req.flash("error", e.message);
        res.redirect("/signup");
    }
};

module.exports.RendersignupForm = (req, res) => {
    res.render("users/signup.ejs");
};

module.exports.Renderloginform = (req, res) => {
    res.render("users/login.ejs");
};

module.exports.Login = async (req, res) => {
    req.flash("success", "Welcome to Wanderlust, logged in successfully");
    let redirecturl = res.locals.redirecturl || "/listings";
    res.redirect(redirecturl);
};

module.exports.Logout = (req, res, next) => {
    req.logout((err) => {
        if (err) {
            next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
};
