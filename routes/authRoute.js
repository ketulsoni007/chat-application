import { Router } from "express";
import { registerController,loginController,uploadAvatarController,getAvatarController,getAllUserController } from "../controller/authController.js";
// import userAuth from "../middlewares/authMiddleware.js";
import formidable from "express-formidable";

const authRoute = Router();

authRoute.post("/register",registerController)
authRoute.post("/login",loginController)
authRoute.post("/upload-avatar",formidable(), uploadAvatarController);
authRoute.get("/avatar/:userId", getAvatarController);
authRoute.get("/user-list/:id", getAllUserController);

export default authRoute;