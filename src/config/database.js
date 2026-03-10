const mongoose=require("mongoose");
require('dotenv').config();

const connectDb=async()=>{
    await mongoose.connect(process.env.db_url);
}

// connectDb().then(()=>{console.log("db connection sucess")}).catch(err=>{console.error("some error occured")});


module.exports={connectDb}
