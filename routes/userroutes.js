const express=require("express")
const { model, models } = require("mongoose")

const router=express.Router()

// const user=require("../models/user")
//onst Menuitem = require("../models/menu_item")

const {jwtauthmiddleware,generatetoken}=require("../jwt")
const importuser = require("../models/user")

router.post("/signup",async(req,res)=>{

    try{
        const data=req.body
        const newuser=new importuser(data)
        const response=await newuser.save()
        console.log("data saved")

        const payload={
            id:response.id
        }
        console.log(JSON.stringify(payload))
        const token=generatetoken(payload)
        console.log("token is",token)

        res.status(200).json({response:response,token:token})
    }
    catch(err){
        console.log(err)
        res.status(500).json({error:"internal server error"})
    }

})


router.post("/login",async(req,res)=>{
    try{
        const {aadharcardnumber,password}=req.body
        const user=await importuser.findOne({aadharcardnumber:aadharcardnumber})
        if(!user || !(await user.comparepassword(password))){
            return res.status(401).json({error:"invalid username or password"})
        }

        const payload={
            id:user.id
        }
        const token=generatetoken(payload)
        res.json({token})

    }
    catch(err){
        console.log(err)
        res.status(500).json({error:"internal server error"})
    }
})

router.get("/profile",jwtauthmiddleware,async(req,res)=>{
    try{
        const userdata=req.user
        const userid=userdata.id
        const user=await importuser.findById(userid)
        console.log("data fetched")
        res.status(200).json(user)
    }
    catch(err){
        console.log(err)
        res.status(500).json({error:"error occured"})
    }
})

// router.get("/detail",async(req,res)=>{
//     try{
//         const data=await person.find()
//         console.log("data fetched")
//         res.status(200).json(data)
//     }
//     catch(err){
//         console.log(err)
//         res.status(500).json({error:"error occured"})
//     }
// })

router.put("/profile/password",jwtauthmiddleware,async(req,res)=>{
    try{
        const userid=req.user.id
        const {currentpassword,newpassword}=req.body

        const user=await importuser.findById(userid)

        if(!(await user.comparepassword(currentpassword))){
            return res.status(401).json({error:"invalid username or password"})
        }

        user.password=newpassword
        await user.save()
        console.log("password updated")

        
        res.status(200).json({message:"password updated"})
    }
    catch(err){
        console.log("error occured",err)
        res.status(500).json({error:"error occured"})
    }
})

// router.get("/:worktype",async(req,res)=>{
//     try{
//         const worktype=req.params.worktype
//         if(worktype=="chef" ||worktype=="waiter"||worktype=="manager"){
//             const response=await person.find({work:worktype})
//             console.log("displayed your search worktype")
//             res.status(200).json(response)
//         }
//         else{
//             res.status(404).json({error:"internal server error"})
//         }
//     }
//     catch(err){
//         console.log("erroe in getting this worktype",err)
//         res.status(400).json({err:"cannot get this worktype"})
//     }
// })

module.exports=router


