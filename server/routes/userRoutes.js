import express from "express";
import userAuth from "../middlewares/userAuth.js";
import {
  getAllUsers,
  getUserData,
  deleteUser,
  updateProfileImage,
  changePassword,
  updateUserProfile,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/data", userAuth, getUserData);
userRouter.get("/", getAllUsers);
userRouter.delete("/delete-user/:userId", deleteUser);
userRouter.put("/update-profile-img", updateProfileImage);
userRouter.post("/change-password", userAuth, changePassword);
userRouter.put("/update/:userId", updateUserProfile);

export default userRouter;
