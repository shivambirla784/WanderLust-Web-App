const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");

const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const {
  renderSignUp,
  signUp,
  renderLogIn,
  logIn,
} = require("../controllers/users.js");

router.route("/signup").get(renderSignUp).post(wrapAsync(signUp));

router
  .route("/login")
  .get(renderLogIn)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    logIn
  );

// log out
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged Out Successfully");
    res.redirect("/listings");
  });
});

module.exports = router;
