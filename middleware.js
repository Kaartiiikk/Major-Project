const Listing = require("./models/listing");
const Review = require("./models/review");

const ExpressError = require("./utils/ExpressError");
const{ listingSchema , reviewSchema} = require("./schema.js");

module.exports.isloggedin = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirecturl = req.originalUrl;
        req.flash("error", "Log in first!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveredirecturl = (req,res,next)=>{
    if( req.session.redirecturl ){
        res.locals.redirecturl = req.session.redirecturl;
    }
    next();
};

module.exports.isOwner = async(req,res,next)=>{
let {id} = req.params;
let listing = await Listing.findById(id);
if(!listing.Owner.equals(res.locals.currUser._id)){
    req.flash("error","You are not the owner of the listing");
    return res.redirect(`/listings/${id}`);
}
next();
};


module.exports.ValidateListing =  (req,res,next)=>{
    let{error} = listingSchema.validate(req.body);
   if(error){
    let errMsg = error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
   }
   else{
    next();
   }
};

module.exports.ValidateReview =  (req,res,next)=>{
    let{error} = reviewSchema.validate(req.body);
   if(error){
    let errMsg = error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400,errMsg);
   }
   else{
    next();
   }
};

module.exports.isReviewAuthor = async(req,res,next)=>{
    let {id,reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of the review ");
        return res.redirect(`/listings/${id}`);
    }
    next();
    };
    