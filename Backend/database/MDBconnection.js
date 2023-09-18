const mongoose = require("mongoose")
const dotenv = require("dotenv")

//Database secure connection
dotenv.config();

//Database connection
const DBconnection = async()=>{
    await mongoose.connect(process.env.MONGO_URL)
    }

module.exports = DBconnection;