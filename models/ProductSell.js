const mongoose=require("mongoose");
const User=require('./User');

const template=new mongoose.Schema({
    product_name:{
        type:String,
        required:true,
        min:1,
        max:255
    },
    price:{
        type:String,
        required:true,
        min:1,
        max:255
    }
});

module.exports=mongoose.model("marketplace",template);