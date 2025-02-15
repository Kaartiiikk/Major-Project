const express = require("express");
const router = express.Router();
const User  = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveredirecturl } = require("../middleware.js");
const UserController = require("../controllers/users.js");

router.route("/signup")
.get(UserController.RendersignupForm)
.post(wrapAsync(UserController.SignUP));

router.route("/login")
.get(UserController.Renderloginform)
.post(saveredirecturl,passport.authenticate("local", {failureRedirect:'/login',failureFlash : true}), 
UserController.Login);

router.get("/logout",UserController.Logout);

module.exports = router;
