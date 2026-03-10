const express=require("express");
const User=require("../models/user")
const authRouter=express.Router();

const bcrypt=require("bcrypt")
const { validateSignUpData } = require("../utils/validation");
authRouter.post("/signup",async (req,res)=>{
   try{
     validateSignUpData(req)
     const userObj={
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        emailId:req.body.emailId,
        password:req.body.password,
        age:req.body.age,
        gender:req.body.gender,
        photoUrl:req.body.photoUrl,
    }
    if(userObj.age<18){
         return res.send("You are not above 18 , please verify age")
    }
    const passHash=await bcrypt.hash(userObj.password,10);
    userObj.password = passHash;

    // console.log(passHash)
    const user=new User(userObj);
    const saveduser =await user.save();
    const token=await user.getJWT();
    res.cookie("token",token,{
      expires :new Date(Date.now()+8*360000)
    })
    //  console.log(req.body)
    res.json({message:"user added sucessfully!",data:saveduser});
   }catch(err){
    // console.error("something went wrong")
    //  console.error(err);
    res.status(400).send(err.message);
   }
})
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });

    if (!user) {
     return  res.status(401).json({message:"invalid credentials"});
    }

    let validPass = false;

    // Check plain password
    if (password === user.password) {
      validPass = true;
    } 
    // Check hashed password
    else {
      validPass = await bcrypt.compare(password, user.password);
    }

    if (!validPass) {
      return res.status(401).json({message:"invalid credentials"});
    }
    // const token=await jwt.sign({_id : user._id},"devT$7",{expiresIn:"7d"})
    const token=await user.getJWT();
      res.cookie("token",token,{expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),httpOnly:true,secure:true,sameSite:"none"})
      // console.log(token)
      res.send(user);
  } catch (err) {
    console.error(err);
    res.status(400).send("server error");
  }
});

authRouter.post("/logout",(req,res)=>{
    res.cookie("token",null,{
        expires:new Date(Date.now())
    });
    res.send("log out sucessfull")
})
module.exports=authRouter