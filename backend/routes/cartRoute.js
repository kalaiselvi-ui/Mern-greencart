import express from "express";
import { UpdateCart } from "../controllers/cartController.js";
import authUser from "../middlewares/authUser.js";

const cartRouter = express.Router();

cartRouter.post("/update", authUser, UpdateCart);

export default cartRouter;
