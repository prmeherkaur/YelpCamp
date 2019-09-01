var mongoose=require("mongoose");
var commentschema=new mongoose.Schema({
    text:String,
    author:String
});
module.exports=mongoose.model("comment",commentschema);