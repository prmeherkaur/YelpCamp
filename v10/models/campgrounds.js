var mongoose =require("mongoose");
var campgschema=new mongoose.Schema({
    name:String,
    image: String,
    description: String,
    author: {
        id:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"user"
        },
        username:String
    },
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"comment"
        }
    ]
});
module.exports=mongoose.model("campg",campgschema);