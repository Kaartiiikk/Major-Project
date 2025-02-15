const Listing  = require("../models/listing");
const review  =  require("../models/review");

module.exports.CreateReview = async(req,res)=>{
    let listing = await Listing.findById(req.params.id);
    let newreview = new review(req.body.review);
    newreview.author =req.user._id; 
    listing.reviews.push(newreview);

    await newreview.save();
    await listing.save();

    req.flash("success","New review added");

    res.redirect(`/listings/${listing._id}`);
 };

 module.exports.DeleteReview = async(req,res)=>{
     let {id,reviewId} = req.params;
     await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted");
    res.redirect(`/listings/${id}`);
 };