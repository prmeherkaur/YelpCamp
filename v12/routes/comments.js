var express=require("express");
var router=express.Router({mergeParams:true});
var campg=require("../models/campgrounds");
var comment=require("../models/comment");
var middleware=require("../middleware");
router.get("/new",middleware.isLoggedin,function(req,res){
    campg.findById(req.params.id,function(err,campg){
        if(err) console.log(err);
        else{
            res.render("comments/new",{campg:campg});
        }
    });
    
});
router.post("/",middleware.isLoggedin,function(req,res){
    campg.findById(req.params.id,function(err,campg){
        if(err) {
            console.log(err);
            res.redirect("/campgrounds");
        }
        else{
            comment.create(req.body.comment,function(err,comment){
                if(err) console.log(err);
                else {
                    comment.author.id=req.user._id;
                    comment.author.username=req.user.username;
                    comment.save();
                    campg.comments.push(comment);
                    campg.save();
                    req.flash("success","Succesfully created comment");
                    res.redirect("/campgrounds/"+campg._id);
                }
            });       
        }
    });
});
//EDIT Comments
router.get("/:comment_id/edit",middleware.checkcommentauth,function(req,res){
    comment.findById(req.params.comment_id,function(err,foundcomment){
        if(err) res.redirect("back");
        else{
            res.render("comments/edit",{campgid:req.params.id,comment:foundcomment});
        }
    });
});
//UPDATE Comments
router.put("/:comment_id",middleware.checkcommentauth,function(req,res){
    comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedcomment){
        if(err) {
            console.log(err);
            res.redirect("back");}
        else{
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});
//DESTROY Comments
router.delete("/:comment_id",middleware.checkcommentauth,function(req,res){
    comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err) res.redirect("back");
        else{
            req.flash("success","Succesfully removed comment");
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});
module.exports=router;