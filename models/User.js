const mongoose=require("mongoose");

const template=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        min:1,
        max:255
    },
    email:{
        type:String,
        required:true,
        min:1,
        max:255
    },
    password:{
        type:String,
        required:true,
        min:1,
        max:255
    },
});

module.exports=mongoose.model("users",template);