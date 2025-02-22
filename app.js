require('dotenv').config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL;
const middleware = require("./middleware");


main()
.then(()=>{
    console.log("connected to db");
})
.catch(err=>{
    console.log(err);
});

async function main() {
await mongoose.connect(dbUrl);
};


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended : true }));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));



const sessionOptions = {
    secret : "mysupersecretcode",
    resave : false,
    saveUninitialized : true, 
    cookie : {
      expires : Date.now() + 7 * 24 * 60 * 60  *  1000 ,
      maxAge : 7 * 24 * 60 * 60 * 1000,
      httpOnly : true ,
    },
};
 

// app.get("/",(req,res)=>{
//     res.send("HI , i am root");
// });


app.use(session(sessionOptions));
app.use(flash());




app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user ;
    next();
});

// app.get("/demouser",async(req,res)=>{
//  let fakeuser = new User({
//     email : "abc@gmail.com",
//      username : "delta-student",
//  });

//   let registeredUser = await User.register(fakeuser,"helloworld");
//   res.send(registeredUser) ;
// })


app.use(middleware.redirectListing)
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);

const Listing = require("./models/listing"); // Import your Listing model
const { listingSchema } = require('./schema.js');
const { clearCache } = require('ejs');

app.get("/search", async (req, res) => {
    try {
        const destination = req.query.destination;

        // Fetch all listings with the selected destination (country)
        const listings = await Listing.find({ country: destination });

        // If no listings found, return a 404
        if (listings.length === 0) {
            return res.status(404).send("No listings found for this destination");
        }

        // Render the show.ejs view, passing the listings and destination
        res.render("search", {listings,destination});
    } catch (err) {
        console.error(err);
        res.status(500).send("Internal server error");
    }
});



// Catch-all route for undefined paths
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page not found!"));
});


app.use((err,req,res,next)=>{
    let {statusCode = 500 , message="Something went wrong!"} = err;
    res.status(statusCode) .render("error.ejs",{message});
   // res.status(statusCode).send(message);
});

app.listen(3000,()=>{
    console.log("server is listening to port 3000");
});

  
