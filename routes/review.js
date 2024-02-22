const express = require("express");
const router = express.Router({ mergeParams: true });

const wrapAsync = require("../utils/wrapAsync.js");

const { isLoggedIn, validateReview, isAuthor } = require("../middleware.js");
const { createReview, deleteReview } = require("../controllers/reviews.js");

//post reviews
router.post("/", isLoggedIn, validateReview, wrapAsync(createReview));
//Delete Review
router.delete("/:reviewId", isLoggedIn, isAuthor, wrapAsync(deleteReview));
module.exports = router;
