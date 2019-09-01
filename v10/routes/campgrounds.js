var express=require("express");
var router=express.Router({mergeParams:true});
var campg=require("../models/campgrounds");
var comment=require("../models/comment");
var middleware=require("../middleware");
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
router.post("/",middleware.isLoggedin,function(req,res){
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
router.get("/new",middleware.isLoggedin,function(req,res){
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
//EDIT campground route
router.get("/:id/edit",middleware.checkcampgauth,function(req,res){
    campg.findById(req.params.id,function(err,foundcg){
        res.render("campgrounds/edit",{campg:foundcg});                
    });
});
//UPDATE campground route
router.put("/:id",middleware.checkcampgauth,function(req,res){
    campg.findByIdAndUpdate(req.params.id,req.body.campground,function(err,foundcg){
        if(err) res.redirect("/campgrounds");
        else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});
//DESTROY campground
router.delete("/:id",middleware.checkcampgauth,function(req,res){
    campg.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds");
        }
    });
});
module.exports=router;