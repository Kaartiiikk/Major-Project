const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync");
const ExpressError = require("../utils/ExpressError");
const review = require("../models/review");
const Listing  = require("../models/listing");
const {ValidateReview, isloggedin, isReviewAuthor} = require("../middleware.js");
const ReviewController = require("../controllers/review.js");



 // post review route 
 router.post("/", isloggedin,ValidateReview,wrapAsync(ReviewController.CreateReview));

 //delete review route 
router.delete("/:reviewId",isloggedin,isReviewAuthor,wrapAsync(ReviewController.DeleteReview));

module.exports = router;
