const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListings } = require("../middleware.js");
const {
  index,
  renderNewForm,
  createListing,
  showListing,
  renderUpdateForm,
  updateListing,
  deleteListing,
} = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router.get("/new", isLoggedIn, renderNewForm); //New Route
router
  .route("/")
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListings,
    wrapAsync(createListing)
  ) //Create Route

  .get(wrapAsync(index)); //Index Route



router
  .route("/:id")
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListings,
    wrapAsync(updateListing)
  ) //Update Route
  .get(wrapAsync(showListing)) //Show Route

  .delete(isLoggedIn, isOwner, wrapAsync(deleteListing)); // DELETE ROUTE

router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(renderUpdateForm)); // Update Route
module.exports = router;
