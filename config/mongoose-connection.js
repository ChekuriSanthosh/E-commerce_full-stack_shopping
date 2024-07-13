const mongoose= require('mongoose');
const config=require("config");
const dbgr=require("debug")("development:mongoose");

mongoose
.connect("mongodb://localhost:27017/scatch")
.then(function(){
    // console.log(`connected`);
    dbgr("connected");
})
.catch(function(err){
    dbgr(err); 
})

module.exports= mongoose.connection;