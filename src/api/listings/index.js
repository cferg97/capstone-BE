import mongoose from "mongoose";
import listingsModel from "./model.js";
import express from "express";
import { JWTAuthMiddleware } from "../../lib/auth/jwtAuth.js";

const listingsRouter = express.Router();

listingsRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const listings = await listingsModel.find({}).populate({
      path: "sellerId",
      select: "username -_id"
    });
    res.send(listings);
  } catch (err) {
    next(err);
  }
});

export default listingsRouter;
