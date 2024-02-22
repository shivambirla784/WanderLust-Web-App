const User = require("../models/user.js");
const flash = require("connect-flash");
module.exports.renderSignUp = (req, res) => {
    res.render("users/signup.ejs");
  }

module.exports.signUp =async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const newUser = new User({
        email,
        username,
      });
      const registerUser = await User.register(newUser, password);
      req.login(registerUser, (err) => {
        if (err) {
          return next();
        }
        req.flash("success", "Welcome to WanderLust");
        res.redirect("./listings");
      });
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("./signup");
    }
  }

  module.exports.renderLogIn= (req, res) => {
    res.render("users/login.ejs");
  }
  module.exports.logIn = async (req, res) => {
    req.flash("success", "Welcome to Wanderlust You are Logged In");
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
  }