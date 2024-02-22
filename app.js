if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");

const Review = require("./models/review.js");

const ExpressError = require("./utils/expressError.js");

const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const listingsRouter = require("./routes/listings.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const Session = require("express-session");
const MongoStore = require("connect-mongo");

const flash = require("connect-flash");
const passport = require("passport");
const LocalStratergy = require("passport-local");
const User = require("./models/user.js");
app.use(express.urlencoded("extended:true"));
const DB_URL = process.env.ATLAS_DB_URL;
main()
  .then(() => {
    console.log("Database Connected");
  })

  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(DB_URL);
}
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
const store = MongoStore.create({
  mongoUrl: DB_URL,
  crypto: { secret: process.env.SECRET },
  touchAfter: 86400,
});
store.on("error", () => {
  console.log("Error In Mongo Session Store " + error);
});
// Session
const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(Session(sessionOptions));
app.use(flash());
// passport authentication
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStratergy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// ROUTES ADD
app.use("/", userRouter);
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewRouter);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went Wrong" } = err;
  // res.status(statusCode).send(message);
  res.status(statusCode).render("error.ejs", { message, statusCode });
});

app.listen(8080, () => {
  console.log("Server is Connected");
});
