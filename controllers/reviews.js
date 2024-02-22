
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
module.exports.createReview=async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author=req.user._id;
    listing.review.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","New Review Posted !"); 
    res.redirect(`/listings/${listing._id}`);
  }
  module.exports.deleteReview =async (req, res) => {
    const { id, reviewId } = req.params;
    const listing = await Listing.findById(id);
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    req.flash("success","Review Deleted!"); 
    res.redirect("/listings/" + id);
  }