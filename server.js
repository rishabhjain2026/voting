const express=require("express")

const app=express()

const db=require("./db")

//const user=require("./models/user")

//require("dotenv").config()


const bodyparser=require("body-parser")
app.use(bodyparser.json())

const PORT=process.env.PORT || 3000


app.listen(PORT,()=>{
    console.log("server has started")
})



const userroutes=require("./routes/userroutes")
app.use("/user",userroutes)

const {jwtauthmiddleware}=require("./jwt")

const candidateroutes=require("./routes/candidateroutes")
app.use("/candidate",candidateroutes)









