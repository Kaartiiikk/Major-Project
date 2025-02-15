const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing  = require("../models/listing");
const{ isloggedin, isOwner ,ValidateListing} = require("../middleware");
const listingController  = require("../controllers/listing.js");
const multer = require('multer');
const {storage} = require("../cloudConfig.js"); 
const upload = multer ({ storage });


router
.route("/")
.get(wrapAsync(listingController.index))
.post(isloggedin,upload.single("listing[image]"),ValidateListing,wrapAsync(listingController.CreateListing));


 // new route
router.get("/new",isloggedin,wrapAsync(listingController.renderNewForm));


router
.route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(upload.single("listing[image]"),isloggedin,isOwner,ValidateListing,wrapAsync(listingController.Updatelisting))
  .delete(isloggedin,isOwner,wrapAsync(listingController.deleteListing));

   
   // edit route 
   router.get("/:id/edit",isloggedin,isOwner,wrapAsync(listingController.renderEditform));
     

     module.exports = router; 