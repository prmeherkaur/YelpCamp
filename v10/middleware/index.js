var campg=require("../models/campgrounds");
var comment=require("../models/comment");
var user=require("../models/user");
var middlewareobj={};
middlewareobj.checkcampgauth=function(req,res,next){
    if(req.isAuthenticated()){
        campg.findById(req.params.id,function(err,foundcg){
            if(err){
                res.redirect("back");
            }
            else{
                if(foundcg.author.id.equals(req.user._id)){
                    next();             
                }
                else{
                    res.redirect("back");
                }               
            }
        });
    }
    else{
        res.redirect("/login");
    }
};
middlewareobj.checkcommentauth=function(req,res,next){
    if(req.isAuthenticated()){
        comment.findById(req.params.comment_id,function(err,foundcm){
            if(err){
                res.redirect("back");
            }
            else{
                if(foundcm.author.id.equals(req.user._id)){
                    next();             
                }
                else{
                    res.redirect("back");
                }               
            }
        });
    }
    else{
        res.redirect("/login");
    }
};
middlewareobj.isLoggedin=function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
};
module.exports=middlewareobj;
