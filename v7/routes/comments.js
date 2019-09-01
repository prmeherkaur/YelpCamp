var express=require("express");
var router=express.Router({mergeParams:true});
var campg=require("../models/campgrounds");
var comment=require("../models/comment");
router.get("/new",isLoggedin,function(req,res){
    campg.findById(req.params.id,function(err,campg){
        if(err) console.log(err);
        else{
            res.render("comments/new",{campg:campg});
        }
    });
    
});
router.post("/",isLoggedin,function(req,res){
    campg.findById(req.params.id,function(err,campg){
        if(err) {
            console.log(err);
            res.redirect("/campgrounds");
        }
        else{
            comment.create(req.body.comment,function(err,comment){
                if(err) console.log(err);
                else {
                    campg.comments.push(comment);
                    campg.save();
                    res.redirect("/campgrounds/"+campg._id);
                }
            });       
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