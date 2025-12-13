const mongoose=require("mongoose");
const connectionrequest=new mongoose.Schema({
    fromUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"UserModel",
        required:true
    },
    toUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"UserModel",
         required:true
    },
    status:{
        type:String,
         required:true,
        enum:{values:["ignored","interested","accepted","rejected"],
          message: "Status must be one of: ignored, interested, accepted, rejected" 
        },
    },
    
},
{
    timestamps:true
})
//when multiple index are needed this aka compound index   1=>accending , -1 =>decending , 2d index
connectionrequest.index({fromUserId:1,toUserId:1})
const ConnectionrequestModel=new mongoose.model("connectionrequest",connectionrequest);


module.exports={ConnectionrequestModel}