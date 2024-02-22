const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

main()
  .then(() => {
    console.log("Database Connected");
  })

  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/Wanderlust");
  console.log("Database Connected")
}

const initDb= async()=>{
    await Listing.deleteMany({});
    initData.data= initData.data.map((obj)=>({
      ...obj,owner :"65ae1baae8f210f2af919dd0"
    }))
    await Listing.insertMany(initData.data);
    console.log("Data is Initialized")
}
initDb();