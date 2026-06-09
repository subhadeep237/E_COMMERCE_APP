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

// auth
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/admin", adminLogin);

// cart (user must be logged in)
userRouter.post("/cart/add", authUser, addToCart);
userRouter.post("/cart/update", authUser, updateCart);
userRouter.get("/cart", authUser, getCart);

export default userRouter;