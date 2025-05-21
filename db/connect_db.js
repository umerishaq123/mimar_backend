const mongoose=require("mongoose");




const  mongooseConnection=(url)=>{
    return mongoose.connect(url);



}


module.exports=mongooseConnection;