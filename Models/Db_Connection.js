const mongoose = require("mongoose");



//Db Connnection
mongoose.connect(process.env.DB_URL)
.then(()=>console.log("DB connection successfull!!!"))
.catch((err)=>console.log("DB Connection error :"+err))

