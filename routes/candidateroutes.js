const express=require("express")
const { model, models } = require("mongoose")

const router=express.Router()

 const importuser=require("../models/user")
//onst Menuitem = require("../models/menu_item")

const {jwtauthmiddleware,generatetoken}=require("../jwt")
const importcandidate = require("../models/candidate")



const checkAdminRole=async(userid)=>{
    try{
        const user=await importuser.findById(userid)
        if(user.role==="admin"){
            return true
        }
    }
    catch(err){
        return false
    }
}

router.post("/",jwtauthmiddleware,async(req,res)=>{

    try{
        if(!(await checkAdminRole(req.user.id)))
            return res.status(403).json({message:"user has not access to this part"})
        
        else{
            const data=req.body
            const newcandidate=new importcandidate(data)
            const response=await newcandidate.save()
            console.log("data saved")
    
            // const payload={
            //     id:response.id
            // }
            // console.log(JSON.stringify(payload))
            // const token=generatetoken(payload)
            // console.log("token is",token)
    
            res.status(200).json({response:response})
        }
    }
    catch(err){
        console.log(err)
        res.status(500).json({error:"internal server error"})
    }

})


// router.post("/login",async(req,res)=>{
//     try{
//         const {aadharcardnumber,password}=req.body
//         const user=await user.findOne({aadharcardnumber:aadharcardnumber})
//         if(!user || !(await user.comparepassword(password))){
//             return res.status(401).json({error:"invalid username or password"})
//         }

//         const payload={
//             id:user.id
//         }
//         const token=generatetoken(payload)
//         res.json({token})

//     }
//     catch(err){
//         console.log(err)
//         res.status(500).json({error:"internal server error"})
//     }
// })

// router.get("/profile",jwtauthmiddleware,async(req,res)=>{
//     try{
//         const userdata=req.user
//         const userid=userdata.id
//         const user=await person.findById(userid)
//         console.log("data fetched")
//         res.status(200).json(user)
//     }
//     catch(err){
//         console.log(err)
//         res.status(500).json({error:"error occured"})
//     }
// })

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

router.put("/:candidateID",jwtauthmiddleware,jwtauthmiddleware,async(req,res)=>{
    try{
        if(! await checkAdminRole(req.params.id)){
            return res.status(404).json({message:"user has not access to this part"})
        }

        const candidateID=req.params.candidateID
        const updatedcadidatedata=req.body

        const response=await importcandidate.findByIdAndUpdate(candidateID,updatedcadidatedata,{
            new:true,
            runValidators:true,
        })


        if(!response){
            return res.status(404).json({error:"candidate not found"})
        }

        console.log("candidate data updated")
        res.status(200).json(response)
    }
    catch(err){
        console.log("error occured",err)
        res.status(500).json({error:"error occured"})
    }
})

router.post("/vote/:candidateID",jwtauthmiddleware,async(req,res)=>{
    candidateID=req.params.candidateID
    userid=req.user.id

    try{
        const candidate=await importcandidate.findById(candidateID)
        if(!candidate){
            return res.status(404).json({message:"candidate not found"})
        }

        const user=await importuser.findById(userid)
        if(!user){
            return res.status(404).json({message:"user not found"})
        }
        if(user .isvoted){
            return res.status(400).json({message:"you have already voted"})
        }
        if(user.role=="admin"){
            return res.status(403).json({message:"admin is not allowed to vote"})
        }
        candidate.votes.push({user:userid})
        candidate.votecount++
        await candidate.save()

        user.isvoted=true
        await user.save()

        res.status(200).json({message:"vote recorded successfully"})
    }
    catch(err){
        console.log("error occured",err)
        res.status(500).json({error:"internal server error"}) 
    }
})

router.get("/votes/count",async(req,res)=>{
    try{
        const candidate=await importcandidate.find().sort({votecount:"desc"})

        const voterecord=candidate.map((data)=>{
            return{
                party:data.party,
                count:data.votecount
            }
        })
        return res.status(200).json(voterecord)
    }
    catch(err){
        console.log("error occured",err)
        res.status(500).json({error:"internal server error"})
    }
})

module.exports=router


