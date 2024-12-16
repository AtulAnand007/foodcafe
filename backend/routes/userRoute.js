import express from 'express';
import { loginUser,registerUser,googlelogin } from '../controllers/userController.js';
const userRouter = express.Router();

userRouter.post("/register",registerUser);
userRouter.post("/login",loginUser);
userRouter.post("/loginWithgoogle" ,googlelogin );
export default userRouter;