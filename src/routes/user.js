const express=require("express");
const {auth}=require("../middleware/auth")
const userRouter=express.Router();
const User=require("../models/user")
const {ConnectionrequestModel}=require("../models/connectionrequest")
//to get all pending connection requests
const USER_SAFE_DATA="firstName lastName age gender about skills photoUrl"
userRouter.get("/user/requests/recived",auth,async(req,res)=>{
   try{
     const loggedInUser=req.user;
     const connectionRequest=await ConnectionrequestModel.find({
        toUserId:loggedInUser._id,
        status:"interested"
     }).populate("fromUserId",["firstName","lastName","age","photoUrl","about"])
     res.json({message:"data fetched sucessfully",data:connectionRequest})
   }catch(err){
    res.status(400).send("error"+err.message)
   }
})

userRouter.get("/user/connections",auth,async(req,res)=>{
   try{
      const loggedInUser=req.user;
      const connectionsreq=await ConnectionrequestModel.find({
         $or:[
            {toUserId:loggedInUser._id,status:"accepted"},
            {fromUserId:loggedInUser._id,status:"accepted"}
         ]
      }).populate("fromUserId",USER_SAFE_DATA).populate("toUserId",USER_SAFE_DATA)
      const data=connectionsreq.map((row)=>{
         if(row.fromUserId._id.toString()===loggedInUser._id.toString()){
            return row.toUserId;
         }
        return row.fromUserId
      })
      res.json({data});
   }catch(err){
      res.send("error"+err.message)
   }
})

userRouter.get("/feed",auth,async(req,res)=>{
   try{
      const loggedInUser=req.user;
      const page=parseInt(req.query.page)||1;
        let limit=parseInt(req.query.limit)||10;
        limit=limit>50?50:limit;
        const skip=(page-1)*limit;
      const connectionRequest=await ConnectionrequestModel.find(
         {
            $or:[
               {fromUserId:loggedInUser._id},{toUserId:loggedInUser._id}
            ]
         }

      ).select("fromUserId toUserId")
      .populate("fromUserId","firstName").populate("toUserId","firstName")
      const hidenUserFromFeed=new Set();
      connectionRequest.forEach(req=>{
         hidenUserFromFeed.add(req.fromUserId.toString());
         hidenUserFromFeed.add(req.toUserId.toString());
      })
      console.log(hidenUserFromFeed);
      const users=await User.find(
         {
          $and:[ { _id:{$nin:Array.from(hidenUserFromFeed)}},{_id:{$ne:loggedInUser._id}}]
         }
      ).select(USER_SAFE_DATA).skip(skip).limit(limit);
      // console.log(users)
      res.send(users)
   }catch(err){
      res.send("error"+err.message)
   }
})
module.exports=userRouter