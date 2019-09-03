var express=require("express");
var router=express.Router({mergeParams:true});
var passport=require("passport");
var user=require("../models/user");
router.get("/",function(req,res){
    res.render("landing");
});

//AUTH ROUTES
router.get("/register",function(req,res){
    res.render("register");
});
router.post("/register",function(req,res){
    user.register(new user({username:req.body.username}),req.body.password,function(err,user){
        if(err){
            
            req.flash("error",err.message);
            res.redirect("/register");
        }
        else{
            passport.authenticate("local")(req,res,function(){
                req.flash("success","Welcome to YelpCamp "+user.usename);
                res.redirect("/campgrounds");
            });
        }
        
    });
});
//LOGIN ROUTES
router.get("/login",function(req,res){
    res.render("login");
});
router.post("/login",passport.authenticate("local",{
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
}),function(req,res){
});
router.get("/logout",function(req,res){
    req.logout();
    req.flash("success","Logged you out!");
    res.redirect("/campgrounds");
});
module.exports=router;