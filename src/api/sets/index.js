import express from "express";
import createHttpError from "http-errors";
import setsModel from "./model.js";
import { JWTAuthMiddleware } from "../../lib/auth/jwtAuth.js";

const setsRouter = express.Router();

setsRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const arr = []
    const sets = await setsModel.find({}).select("name -_id");
    sets.map((i) => {
        arr.push(i.name)
    })
    res.send(arr)
  } catch (err) {
    next(err);
  }
});

export default setsRouter;
