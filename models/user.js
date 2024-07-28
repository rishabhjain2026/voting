const mongoose=require("mongoose");
const bcrypt=require("bcrypt")
const { type } = require("os");
const { boolean } = require("webidl-conversions");

const userschema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    email:{
        type:String
    },
    mobile:{
        type:String
    },
    address:{
        type:String,
        required:true
    },
    aadharcardnumber:{
        type:Number,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["voter","admin"],
        default:"voter"
    },
    isvoted:{
        type:Boolean,
        default:false
    }
})

userschema.pre("save",async function(next){
    const person=this;

    if(!person.isModified("password")) return next()

    try{
        const salt=await bcrypt.genSalt(10)
        const hashedpassword=await bcrypt.hash(person.password,salt)
        person.password=hashedpassword
        next()
    }
    catch(err){
        return next(err)
    }
})

userschema.methods.comparepassword=async function(candidatepassword){
    try{
        const isMatch=await bcrypt.compare(candidatepassword,this.password)
        return isMatch
    }
    catch(err){
        throw err
    }
}

const user=mongoose.model("person",userschema)

module.exports=user;