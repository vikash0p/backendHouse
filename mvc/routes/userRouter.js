import express from 'express';
import { RegisterUser, LoginUser, LogoutUser, getUserDetails } from "../controllers/userController.js";
import { AuthMiddleware } from "../../middleware/AuthMidddleware.js";

const userRouter = express.Router();

userRouter.post('/register', RegisterUser);
userRouter.post('/login',  LoginUser);
userRouter.delete('/logout', LogoutUser);
userRouter.get('/getUserDetails',AuthMiddleware, getUserDetails);

export default userRouter;
