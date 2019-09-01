var app=require("express")(),
bp=require("body-parser"),
mongoose=require("mongoose"),
campg=require("./models/campgrounds"),
seedDB=require("./seeds");
//comment=require("./models/comment"),
//user=require("./models/user");

mongoose.connect("mongodb://localhost:27017/yelp_camp",{useNewUrlParser:true});


/* campg.create({
    name:"River adventure", 
    image:"https://pixabay.com/get/54e5d4414356a814f6da8c7dda793f7f1636dfe2564c704c732a7fd0954dcd5a_340.jpg",
    description:"This is an awesome campsite just beside the river, gear up for an exquisite adventure"
    
},function(err,campg){
    if(err){
        console.log("error",err);
    }
    else{
        console.log("newly created campground");
        console.log(campg);
    }
}); */
app.use(bp.urlencoded({extended: true}));
app.set("view engine","ejs");
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
            res.render("index",{campgrounds:allcampgrounds});
        }
    });
    
}); 
app.post("/campgrounds",function(req,res){
    var cname=req.body.name;
    var cimage=req.body.image;
    var cg={name: cname,image: cimage};
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
    res.render("new");
});
app.get("/campgrounds/:id",function(req,res){
    var id=req.params.id;
    campg.findById(id).populate("comments").exec(function(err,foundcg){
        if(err){
            console.log(err);
        }
        else{
            res.render("show",{campg:foundcg});
        }
    });
    
});
app.listen(3000,function(req,res){
    console.log("server has started");
});