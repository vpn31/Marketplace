const express=require("express");
const bcrypt=require("bcrypt");
const router=express.Router();
const jwt=require("jsonwebtoken");
const cookieParser=require('cookie-parser');

const {ensureAuthentication}=require("../middlewares/auth");

router.use(cookieParser());

const User=require("../models/User");
const Product=require("../models/ProductSell");

const maxAge=12*60*60;

function createToken(id) {
    return jwt.sign({id},`${process.env.jwtSecret}`,{
        expiresIn: maxAge
    });
}

router.post("/signup",(req,res)=> {

    const {name,email,password}=req.body;

    if(!name || !email || !password) {
        return res.status(400).json({error:"All fields are required"});
    }

    User.findOne({email:email})
    .then(user=> {
        if(user) {
            return res.status(400).json({error :"User already exists"});
        }
        const newUser=new User({
            name,
            email,
            password
        })

        bcrypt.genSalt(10)
        .then(salt=> {
            bcrypt.hash(newUser.password,salt)
            .then(hash=> {
                newUser.password=hash;

                newUser.save()
                .then(()=> {
                    const token=createToken(newUser._id);
                    //console.log(token);
                    res.cookie('jwt',token,{httpOnly:true, maxAge:maxAge});
                    return res.status(200).json({msg:"Customer registered", name:name, email:email});
                })
                .catch((err)=> {
                    return res.status(500).json({msg:"Customer not registered", error:err});
                })
            })
            .catch((err)=> {
                return res.status(500).json({error:err});
            })
        })
        .catch((err)=> {
            return res.status(500).json({error:err});
        })
    })
    .catch(err => {
        return res.status(500).json({error:err});
    })

})

router.post('/login',(req,res)=> {
    const {email,password}=req.body;

    if(!email || !password) {
        return res.status(400).json({error:"All fields are required"});
    }


    User.findOne({email:email})
    .then(user=> {
        if(!user)
            return res.status(400).json({msg:"User not registered"});
        
        bcrypt.compare(password,user.password)
        .then(auth=> {
            if(auth) {

                const token=createToken(user._id);
                res.cookie('jwt',token,{httpOnly:true, maxAge:maxAge});
                return res.status(200).json({msg:"User logged in", name:user.name, email:email});
            }
            else
                return res.status(400).json({msg:"Wrong password"});
        })
        .catch((err)=> {
            return res.status(500).json({error:err});
        })
    })
    .catch((err)=> {
        return res.status(500).json({error:err});
    })
})

router.get("/logout",(req,res)=> {
    res.cookie('jwt','',{maxAge:1});
    res.status(200).json({msg:"Logout successful"});
})

router.post("/sell",seller=ensureAuthentication,(req,res)=> {

    const {product_name,price}=req.body;

    if(!product_name || !price) {
        return res.status(400).json({error:"All fields are required"});
    }

    const product=new Product({
        product_name,
        price
    });

    product.save()
    .then(()=> {
        return res.status(200).json({msg:"Product registered"});
    })
    .catch((err)=> {
        return res.status(500).json({msg:"Product not registered", error:err});
    })

    //return res.status(200).json({msg:"Hello from sell"});

})

router.get("/buy",ensureAuthentication,(req,res)=> {

    const {product_name}=req.body;

    Product.find({product_name:product_name})
    .then(products=>{
        return res.status(200).json({products:products});
    })
    .catch(err=> {
        return res.status(500).json({error:err});
    })

    //return res.status(200).json({msg:"Hello from buy"});
})

module.exports=router;