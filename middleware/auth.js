import jwt from 'jsonwebtoken';
import UserModel from  '../models/UserModel.js';

export const authMiddleware = async (req, res, next) => {

   try {
  
  const token = req.cookies.jwt;
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized - No token Provided' });
  }
  
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
   

    if(!tokenDecode){
      return res.status(401).json({message:"Unathorized -Invalid Token"});
    }
   const user = await UserModel.findById(tokenDecode.userId).select("-password");

   if(!user){
     return res.status(404).json({message:"User not found"});
   }
   req.user = user;

    next();
  } 
  catch (error) {
    console.log('Error in authMiddleware ', error.message);
    return res.status(500).json({ success: false, message: 'Invalid server error' });
  }
};
