var express=require("express");
var router=express.Router({mergeParams:true});
var campg=require("../models/campgrounds");
var comment=require("../models/comment");
router.get("/",function(req,res){
    campg.find({},function(err,allcampgrounds){
        if(err){
            console.log(err);
        }
        else{
            console.log("found something");
            res.render("campgrounds/index",{campgrounds:allcampgrounds, currentuser:req.user});
        }
    });
    
}); 
router.post("/",isLoggedin,function(req,res){
    var cname=req.body.name;
    var cimage=req.body.image;
    var desc=req.body.description;
    var author={
        id:req.user._id,
        username:req.user.username
    };
    var cg={name: cname,image: cimage,description: desc,author:author};
    campg.create(cg,function(err,campg){
        if(err){
            console.log(err);
        }
        else{
            console.log("newly created campground");
            res.redirect("/campgrounds");
        }
    });
    
});
router.get("/new",isLoggedin,function(req,res){
    res.render("campgrounds/new");
});
router.get("/:id",function(req,res){
    var id=req.params.id;
    campg.findById(id).populate("comments").exec(function(err,foundcg){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/show",{campg:foundcg});
        }
    });
    
});
function isLoggedin(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
module.exports=router;