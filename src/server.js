const express=require("express");
const app=express();
const cors=require("cors")
app.use(cors(
    {
        // origin: "https://dev-tinder-web-hemanth.vercel.app",
        origin:"http://localhost:5173",
        credentials: true,
    }
))
const cookieParser=require("cookie-parser")
app.use(cookieParser())
app.use(express.json())
const db =require("./config/database");
// const User=require("./models/user");
const User=require("./models/user")
// const { validateSignUpData } = require("./utils/validation");
const jwt = require('jsonwebtoken');
// const {auth} =require("./middleware/auth")

const authRouter=require("./routes/autho")
const profileRouter=require("./routes/profile")
const sendrequest=require("./routes/sendRequest")
const userRouter=require("./routes/user")
app.use("/",authRouter)
app.use("/",sendrequest);
app.use("/",profileRouter)
app.use("/",userRouter)
app.get("/",(req,res)=>{
    res.send("hello")
})

const bcrypt=require("bcrypt");
// import { validateSignUpData } from "./utils/validation";
// app.post("/signup",async (req,res)=>{
//    try{
//      validateSignUpData(req)
//      const userObj={
//         firstName:req.body.firstName,
//         lastName:req.body.lastName,
//         emailId:req.body.emailId,
//         password:req.body.password,
//         age:req.body.age,
//         gender:req.body.gender
//     }
//     if(userObj.age<18){
//          return res.send("You are not above 18 , please verify age")
//     }
//     const passHash=await bcrypt.hash(userObj.password,10);
//     userObj.password = passHash;

//     // console.log(passHash)
//     const user=new User(userObj)
//      await user.save();
//     //  console.log(req.body)
//     res.send("db stored sucess");
//    }catch(err){
//     // console.error("something went wrong")
//     //  console.error(err);
//     res.status(400).send(err.message);
//    }
// })
// app.post("/login",async (req,res)=>{
//     try{
//         const {emailId,password}=req.body;
//         const user=await User.findOne({emailId:emailId});
//         // const ispasswordValid= await bcrypt.compare(password,passHash||User.find({password:password}));
//         if(!user){
//             //  res.send("wrong email credentials entered")
//             throw new Error("email is not correct")
//         }
//         const validPass =await bcrypt.compare(password, user.password);
//        if (!validPass){
//            res.send("wrong password ")
//         }else{
//             throw new Error("password is not valid")
//         }
        
//     }catch(err){
//         throw new Error("not validated")
//     }
// })
// app.post("/login", async (req, res) => {
//   try {
//     const { emailId, password } = req.body;

//     const user = await User.findOne({ emailId });

//     if (!user) {
//       res.send("invalid credentials");
//     }

//     let validPass = false;

//     // Check plain password
//     if (password === user.password) {
//       validPass = true;
//     } 
//     // Check hashed password
//     else {
//       validPass = await bcrypt.compare(password, user.password);
//     }

//     if (!validPass) {
//       res.send("invalid credentials");
//     }
//     // const token=await jwt.sign({_id : user._id},"devT$7",{expiresIn:"7d"})
//     const token=await user.getJWT();
//       res.cookie("token",token,{expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)})
//       console.log(token)
//       res.send("login success");
//   } catch (err) {
//     console.error(err);
//     res.status(500).send("server error");
//   }
// });
// app.get("/profile", auth,async(req,res)=>{
//     // const cookie= req.cookies;
//     // console.log(cookie)
//     // const {token}=cookie;
//     // if(!token){
//     //     throw new Error("not a valid token")
//     // }
//   //  const msg = await jwt.verify(token,"devT$7")
//   //  console.log(msg)
//   //  const id=msg;
//   //  const user=await User.findById(id);
//   const user=req.user;
//    if(!user){
//     throw new Error("login again")
//    }
//     res.send(user)
// })

app.get("/getuser",async (req,res)=>{
    const email=req.body.email;
    try{
        let result= await User.find({emailId:email})
        if(result.length===0){
            res.status(400).send("user not found")
        }
    console.log(result)
    res.send("user find sucess"+result)
    }catch(err){
        console.error("not found")
    }
})
// app.get("/feed",async (req,res)=>{
//     const users= await User.find({});
//     res.send(users)
// })
app.delete("/delete",async (req,res)=>{
    try{
        const delId=req.body.delId;
        //findOneAndDelete({_id:delId}) ===findOneAndDelete(id)
    const user= await User.findOneAndDelete(delId);

    res.send(user.firstName+" deleted sucessfully")
    }catch(err){
        console.error("something went wrong")
    }
})

app.patch('/update/:id',async (req,res)=>{
   try{
     let id=req.params?.id;
     const { id: ignoredId, emailId: ignoredemailId, ...upd } =req.body;
    let user=await User.findByIdAndUpdate(id,{$set:upd},{new:true, runValidators:true})
    // console.log(user)
    res.send(" user updated sucess")
   }catch(err){
    console.error(err)
     res.status(400).send(err.message);
   }
})
// app.post("/sendrequest",auth,(req,res)=>{
//   const user=req.user;
//   res.send(user.firstName+" send connection request")
// })
app.use("/",(req,res)=>{
    res.status(400).send("error plz try again")
})
db.connectDb().then(()=>{
    console.log("db connection sucess") ;
    app.listen(3000,()=>{
       console.log("server started ")
    })
}).catch((err)=>{
    console.error("db not conncted")
})



