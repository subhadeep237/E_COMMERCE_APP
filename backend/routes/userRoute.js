import express from "express";
import {
  loginUser,
  registerUser,
  adminLogin,
  addToCart,
  updateCart,
  getCart,
} from "../controllers/userController.js";

import authUser from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin);

// Cart routes (need login token)
userRouter.post("/cart/add", authUser, addToCart);
userRouter.post("/cart/update", authUser, updateCart);
userRouter.get("/cart", authUser, getCart);

export default userRouter;