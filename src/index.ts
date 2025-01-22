import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { ContentModel, UserModel } from "./db";
import { JWT_PASSWORD } from "./config";
import { userMiddleware } from "./middleware";



const app = express();
app.use(express.json())

app.post("/api/v1/signup",async function (req, res) {

  const username = req.body.username;
  const password = req.body.password;

  try {
    await UserModel.create({
      username:username,
      password:password
    })
  
    res.json({
      messsage:"User signed up"
    })
  
    
  } catch (e) {

    res.status(411).json({
      message:"User already exists"
    })
    
  }

  
});

app.post("/api/v1/signin",async function (req, res) {
  const username = req.body.username
  const password = req.body.password
  const existingUser = await UserModel.findOne({
    username,
    password
  })

  if(existingUser){
    const token = jwt.sign({
      id:existingUser._id
    },JWT_PASSWORD)
    res.json({
      token
    })
  }else{
    res.status(403).json({
      message:"Incorrect credentials"
    })
  }
  


});

app.post("/api/v1/content",userMiddleware, async function (req, res) {
  const link = req.body.link;
  const type = req.body.type;

  await ContentModel.create({
    link,
    type,
    //@ts-ignore
    userId:req.userId,
    tags:[]
  })

  res.json({
    message:"Content added"
  })

});

app.get("/api/v1/content",userMiddleware, async function (req, res) {
 //@ts-ignore
 const  userId = req.userId ;
 const content = await ContentModel.find({
  userId:userId
 }).populate("userId","username")

 res.json({
  content
 })

});

app.delete("/api/v1/content",userMiddleware,async function (req, res) {
  const contentId = req.body.contentId;

  await ContentModel.deleteMany({
    contentId,
    //@ts-ignore
    userId :req.userId

  })
  res.json({
    message:"Deleted"
  })

});

app.post("/api/v1/share", function (req, res) {

});

app.get("/api/v1/:shareLink", function (req, res) {
  
});

app.listen(3000,function(){
 console.log("app is listening at port 3000")
})
