const mongoose=require("mongoose");
const validator=require("validator");
const {Schema}=mongoose;
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken")
const userSchema= new Schema(
    {
        firstName:{type:String,required:true,index:true, minLength:4,maxLength:14},
        lastName:String,
        emailId:{type:String,required:true,unique:true,lowercase:true,trim:true,validate(value){
            if(!validator.isEmail(value)){
                throw new Error("invalid email "+value)
            }
        }},
        password:{type:String,validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("enter a strong passwoed"+value)
            }
        }},
        age:{type:Number,min:18},
        gender:{type:String,validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender is not valid")
            }
        
        }},
        about:{type:String,default:"this is about section not mentioned"},
        skills:{type:[String]},
        photoUrl:{type:String,default:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRA6g9BWr61gs6KYIq3zjFEy36Z8OuOIJQ75A&s"}
    },
    {
        timestamps:true
    }
)
//for arrow func will work due to this 
userSchema.methods.getJWT=async function(){
    const user=this;
const token=await jwt.sign({_id:user._id},"devT$7",{expiresIn:"6d"});
return token
}

userSchema.methods.bcrypt=async function(){
    const user=this;
     const passHash=await bcrypt.hash(user.password,10);
        userObj.password = passHash;
}
const UserModel=mongoose.model('UserModel',userSchema)

module.exports=UserModel;