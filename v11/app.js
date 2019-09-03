var express=require("express"),
app=express(),
passport=require("passport"),
bp=require("body-parser"),
mongoose=require("mongoose"),
flash=require("connect-flash"),
localstrategy=require("passport-local"),
methodoverride=require("method-override"),
plmongoose=require("passport-local-mongoose"),
campg=require("./models/campgrounds"),
comment=require("./models/comment"),
user=require("./models/user"),
//router=express.router();
seedDB=require("./seeds");
var commentroutes=require("./routes/comments");
var campgroundroutes=require("./routes/campgrounds");
var indexroutes=require("./routes/index");

mongoose.connect("mongodb://localhost:27017/yelp_camp_v6",{useNewUrlParser:true});
app.use(bp.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));
app.use(methodoverride("_method"));
//seedDB();
//PASSPORT CONFIG
app.use(require("express-session")({
    secret:"qwerty",
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());
//PASSING CURRENT USER
app.use(function(req,res,next){
    res.locals.currentuser=req.user;
    res.locals.error=req.flash("error");
    res.locals.success=req.flash("success");
    next();
});
app.use("/",indexroutes);
app.use("/campgrounds",campgroundroutes);
app.use("/campgrounds/:id/comments",commentroutes);
app.listen(3000,function(req,res){
    console.log("server has started");
});