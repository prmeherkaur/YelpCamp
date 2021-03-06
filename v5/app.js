var express=require("express"),
app=express(),
bp=require("body-parser"),
mongoose=require("mongoose"),
campg=require("./models/campgrounds"),
comment=require("./models/comment");
seedDB=require("./seeds");

mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser:true});
app.use(bp.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
seedDB();
app.get("/",function(req,res){
    res.render("landing");
});
app.get("/campgrounds",function(req,res){
    campg.find({},function(err,allcampgrounds){
        if(err){
            console.log(err);
        }
        else{
            console.log("found something");
            res.render("campgrounds/index",{campgrounds:allcampgrounds});
        }
    });
    
}); 
app.post("/campgrounds",function(req,res){
    var cname=req.body.name;
    var cimage=req.body.image;
    var desc=req.body.description;
    var cg={name: cname,image: cimage,description: desc};
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
app.get("/campgrounds/new",function(req,res){
    res.render("campgrounds/new");
});
app.get("/campgrounds/:id",function(req,res){
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
app.get("/campgrounds/:id/comments/new",function(req,res){
    campg.findById(req.params.id,function(err,campg){
        if(err) console.log(err);
        else{
            res.render("comments/new",{campg:campg});
        }
    });
    
});
app.post("/campgrounds/:id/comments",function(req,res){
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
app.listen(3000,function(req,res){
    console.log("server has started");
});