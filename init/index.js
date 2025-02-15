const mongoose  = require("mongoose");
const initData = require("./data");
const Listing = require("../models/listing") ;


const MONGO_URL = "hello";
main()
.then(()=>{
    console.log("connected to db");
})
.catch(err=>{
    console.log(err);
});

async function main() {
    console.log(MONGO_URL);
await mongoose.connect(MONGO_URL);
}

const initdb = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({
      ...obj,
      Owner:"677c0d45790c37901e023bf7",
    }));
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
};
initdb();