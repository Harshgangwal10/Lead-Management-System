import express from 'express';
import { registerUser, loginUser, logout, checkAuth } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';

const Router = express.Router();
Router.post('/register', registerUser);         
Router.post('/login', loginUser);               
Router.post('/logout', logout);             
Router.get('/me', authMiddleware, checkAuth);        

export default Router;
