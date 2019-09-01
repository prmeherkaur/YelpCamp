var express=require("express"),
app=express(),
passport=require("passport"),
bp=require("body-parser"),
mongoose=require("mongoose"),
localstrategy=require("passport-local"),
plmongoose=require("passport-local-mongoose"),
campg=require("./models/campgrounds"),
comment=require("./models/comment"),
user=require("./models/user"),
seedDB=require("./seeds");

mongoose.connect("mongodb://localhost:27017/yelp_camp_v6",{useNewUrlParser:true});
app.use(bp.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
seedDB();
//PASSPORT CONFIG
app.use(require("express-session")({
    secret:"qwerty",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
//PASSING CURRENT USER
app.use(function(req,res,next){
    res.locals.currentuser=req.user;
    next();
});
//RESTFUL ROUTES
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
            res.render("campgrounds/index",{campgrounds:allcampgrounds, currentuser:req.user});
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
app.get("/campgrounds/:id/comments/new",isLoggedin,function(req,res){
    campg.findById(req.params.id,function(err,campg){
        if(err) console.log(err);
        else{
            res.render("comments/new",{campg:campg});
        }
    });
    
});
app.post("/campgrounds/:id/comments",isLoggedin,function(req,res){
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
//AUTH ROUTES
app.get("/register",function(req,res){
    res.render("register");
});
app.post("/register",function(req,res){
    user.register(new user({username:req.body.username}),req.body.password,function(err,user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req,res,function(){
            res.redirect("/campgrounds");
        });
    });
});
//LOGIN ROUTES
app.get("/login",function(req,res){
    res.render("login");
});
app.post("/login",passport.authenticate("local",{
    successRedirect:"/campgrounds",
    failureRedirect:"/login"
}),function(req,res){
});
app.get("/logout",function(req,res){
    req.logout();
    res.redirect("/campgrounds");
});
function isLoggedin(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}
app.listen(3000,function(req,res){
    console.log("server has started");
});