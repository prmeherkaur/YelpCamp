var campg=require("../models/campgrounds");
var comment=require("../models/comment");
var user=require("../models/user");
var middlewareobj={};
middlewareobj.checkcampgauth=function(req,res,next){
    if(req.isAuthenticated()){
        campg.findById(req.params.id,function(err,foundcg){
            if(err){
                req.flash("error","Campground not found!");
                res.redirect("back");
            }
            else{
                if(foundcg.author.id.equals(req.user._id)){
                    next();             
                }
                else{
                    req.flash("error","You don't have permission to do that");
                    res.redirect("back");
                }               
            }
        });
    }
    else{
        req.flash("error","You are not authorised to do that!");
        res.redirect("/login");
    }
};
middlewareobj.checkcommentauth=function(req,res,next){
    if(req.isAuthenticated()){
        comment.findById(req.params.comment_id,function(err,foundcm){
            if(err){
                req.flash("error","Comment not found!");
                res.redirect("back");
            }
            else{
                if(foundcm.author.id.equals(req.user._id)){
                    next();             
                }
                else{
                    req.flash("error","You don't have permission to do that!");
                    res.redirect("back");
                }               
            }
        });
    }
    else{
        req.flash("error","You are not authorised to do that!");
        res.redirect("/login");
    }
};
middlewareobj.isLoggedin=function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error","You need to be logged in to do that!");
    res.redirect("/login");
};
module.exports=middlewareobj;
