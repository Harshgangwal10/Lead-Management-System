import bcrypt from 'bcryptjs'; 
import UserModel from "../models/UserModel.js";
import validator from 'validator';
import { generateToken } from '../config/utils.js';


// login 

 const loginUser  = async (req, res) => {
  const { email, password } = req.body;
  try{
    const user = await UserModel.findOne({ email });
    if (!user){
      return res.status(401).json({ success:false, message: "User not found"});
    }
    
    const isPasswordCorrect =await bcrypt.compare(password,user.password);

    if(!isPasswordCorrect){
      return res.status(401).json({success:false,message:"Incorrect credentials"})
    }
    
     generateToken(user.id,res)

     res.status(200).json({
      success:true,
     
     })  
  }
   catch(error){
    return res.status(500).json({success:false ,message:"Server error"})
  }
 }


// register 

 const registerUser = async (req, res) => {
  const { email, password } = req.body;

  try{
    //check for user already present or not 
  const exists = await UserModel.findOne({ email });
  if (exists){
   return res.status(400).json({ success:false, message: "Email already exists" });
  }
  //validate the email
  if(!validator.isEmail(email)){
    return res.status(400).json({success:false ,message:"Please Enter a valid email"})
  }
  if(password.length<6){
    return res.status(400).json({success:false ,message:"Please enter a strong password"})
  }
  //hashing
  const salt = await bcrypt.genSalt(10);
  const hashedPassword =await bcrypt.hash(password,salt);
  

  const newUser = new UserModel({
    email,
    password:hashedPassword
  })

  if(newUser){
    generateToken(newUser.id,res)
     await newUser.save();
       res.status(201).json({ success: true, message: "Registered" });
  } 
  else{
     res.status(400).json({message:"Invalid user data"})
  }
  }
  catch (error) {
    return res.status(500).json({ success: false, message: " internal error" });
  }
  }


 const checkAuth = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("Error in checkAuth controller", error.message);
    res.status(500).json({message:"Internal Server Error"});
  }
};

 const logout = async (req, res) => {
  try {
  res.cookie("jwt", "", {maxAge:0})
  res.status(200).json({message:"Logged out successfully"});
 } catch (error) {
  res.status(500).json({message:"Internal Server Error"})
 }
};

export {loginUser,registerUser,checkAuth,logout};