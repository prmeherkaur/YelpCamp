var app=require("express")();
var bp=require("body-parser");
var campgrounds=[
    {name:"Salmon Creek", image:"https://pixabay.com/get/57e1d3404e53a514f6da8c7dda793f7f1636dfe2564c704c732a7fd0954dcd5a_340.jpg"},
    {name:"Mountain view", image:"https://pixabay.com/get/54e8d7464b5bab14f6da8c7dda793f7f1636dfe2564c704c732a7fd0954dcd5a_340.jpg"},
    {name:"River adventure", image:"https://pixabay.com/get/54e5d4414356a814f6da8c7dda793f7f1636dfe2564c704c732a7fd0954dcd5a_340.jpg"}
]
app.use(bp.urlencoded({extended: true}));
app.set("view engine","ejs");
app.get("/",function(req,res){
    res.render("landing");
});
app.get("/campgrounds",function(req,res){
    res.render("campgrounds",{campgrounds:campgrounds});
});
app.post
("/campgrounds",function(req,res){
    var cname=req.body.name;
    var cimage=req.body.image;
    var cg={name: cname,image: cimage};
    campgrounds.push(cg);
    res.redirect("/campgrounds");
});
app.get("/campgrounds/new",function(req,res){
    res.render("new");
});
app.listen(3000,function(req,res){
    console.log("server has started");
});