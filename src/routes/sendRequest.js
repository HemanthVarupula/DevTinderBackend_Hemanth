const express=require("express");
const {auth} =require("../middleware/auth")
const User=require("../models/user")
const requestRouter=express.Router();
const {ConnectionrequestModel}=require("../models/connectionrequest")
requestRouter.post("/request/send/:status/:touserid",auth,async (req,res)=>{
  try{
    const fromUserId=req.user._id;
    const toUserId=req.params.touserid;
    const status=req.params.status;
    const allowedStatus=["ignored","interested"];
    if(!allowedStatus.includes(status)){
      return res.status(400).json({message:"Invalid status type"})
    }; 
    if(toUserId==fromUserId){
      return res.status(400).json({message:"you cant send request yourself"})
    }
    const toUser=await User.findById(toUserId);
    if(!toUser){
      return res.status(404).json({message:"user not found"})
    }
    const exitingConnectionrequest=await ConnectionrequestModel.findOne({
      $or:[
        {
           fromUserId,
           toUserId
        },
        {
          fromUserId:toUserId,toUserId:fromUserId
        }
      ]
    })

    // console.log(exitingConnectionrequest)
    if(exitingConnectionrequest){
      return res.status(400).send("bad request,connection request already present")
    }
    const connectionRequest=new ConnectionrequestModel({
      fromUserId,
      toUserId,
      status
    })
    const data=await connectionRequest.save();
    res.json(({message:`${req.user.firstName} is ${status} in ${toUser.firstName}`,data}))
  }catch(err){
    res.status(400).send("Error"+err.message)
  }
})

requestRouter.post("/request/review/:status/:requestId",auth,async(req,res)=>{
  try{
    const {status,requestId}=req.params;
    const loggedInUser=req.user;
    const allowedStatus=["accepted","rejected"];
    if(!allowedStatus.includes(status)){
      return res.status(400).json({message:"status not allowed"})
    }
    const connectionRequest=await ConnectionrequestModel.findOne(
      {
        _id:requestId,
        toUserId:loggedInUser._id,
        status:"interested"
      }
    )
            console.log("🔍 requestId:", requestId);
        console.log("🔍 loggedInUser._id:", loggedInUser._id.toString());
        console.log("🔍 Looking for status: interested",status);
    console.log("✅ Found exact match:", !!connectionRequest);
    if(!connectionRequest){
      return res.status(404).json({message:"connection request not found"})
    }
    connectionRequest.status=status;
    const data =await connectionRequest.save();
    res.json({message:"connection request sucessful"+status,data})
  }catch(err){
    res.status(400).send("error"+err.message)  }
})
module.exports=requestRouter;