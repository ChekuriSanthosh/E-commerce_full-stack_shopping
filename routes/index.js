const express=require("express");
const router=express.Router();
const isLoggedin=require("../middlewares/isLoggedin");
const productModel= require("../models/product-model");
const userModel = require("../models/user-model");

router.get("/",function(req,res){
    let error=req.flash("error");
    res.render("index",{error, loggedin: false});
});

router.get("/shop",isLoggedin, async function(req,res){
    let products =await productModel.find();
    let success=req.flash("success");

    res.render("shop",{products,success});
});


router.get("/account",isLoggedin, async function(req,res){
    let user= await userModel
    .findOne({email: req.user.email});

    res.render("account",{user});
});


router.get("/cart",isLoggedin, async function(req,res){
    let user= await userModel
    .findOne({email: req.user.email})
    .populate("cart");
    let totalbill=0;
    let totalmrp=0;
    let totaldiscount=0;
    user.cart.forEach(function(item){
        totalmrp+=item.price;
        totaldiscount+=item.discount;
    })

    totalbill=totalmrp-totaldiscount+20;


    res.render("cart",{user, totalbill, totaldiscount, totalmrp});
});


router.get("/addtocart/:id",isLoggedin,async function(req,res){
    let user=await userModel.findOne({email: req.user.email});
    user.cart.push(req.params.id);
    await user.save();
    req.flash("success","Added to the cart");
    res.redirect("/shop");
})



module.exports=router;
