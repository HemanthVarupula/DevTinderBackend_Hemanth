const express=require("express");
const profileRouter=express.Router();
const {auth} =require("../middleware/auth")
const {validateProfileEditData}=require("../utils/validation");
const UserModel = require("../models/user");
profileRouter.get("/profile", auth,async(req,res)=>{
    // const cookie= req.cookies;
    // console.log(cookie)
    // const {token}=cookie;
    // if(!token){
    //     throw new Error("not a valid token")
    // }
  //  const msg = await jwt.verify(token,"devT$7")
  //  console.log(msg)
  //  const id=msg;
  //  const user=await User.findById(id);
  const user=req.user;
   if(!user){
    throw new Error("login again")
   }
    res.send(user)
})
profileRouter.patch("/profile/edit",auth,async (req,res)=>{
    try{
        // if(!validateProfileEditData(req)){
        //     return res.status(401).json({message:"invaild edit requet"})
        // }
        const userid=req.user._id;
        // console.log(userid)
        console.log("======================================")
        // Object.keys(req.body).forEach(key=>user[key]=req.body[key]);
        const updateUser=await UserModel.findByIdAndUpdate(
            userid,
            { $set: req.body },
      { new: true, runValidators: true }
        )

        console.log(userid)
        res.json(updateUser)
        // await user.save();
        // res.send("edit sucess")
    }catch(err){
        return res.status(401).send(err.message);
    }
})
module.exports=profileRouter;