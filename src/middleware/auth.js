const jwt=require("jsonwebtoken")
// const User=require("../models/user")
const UserModel=require("../models/user")
const auth=async(req,res,next)=>{
    try{
    const cookie=req.cookies;
    const {token}=cookie;
    if(!token){
        return res.status(401).send("u r not authorised, please login ")
    }
    const dmsg=await jwt.verify(token,"devT$7")
    const {_id}=dmsg;
    const user=await UserModel.findById(_id);
    if(!user){
        throw new Error("user not found")
    }
    req.user=user;
    next();
    }catch(err){
        res.status(400).send("Error"+err.message)
    }
}

module.exports={
    auth
}