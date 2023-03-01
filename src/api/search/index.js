import express from "express";
import mongoose from "mongoose";
import q2m from "query-to-mongo";
import cardSchema from "./model.js";

const searchRouter = express.Router();

searchRouter.get("/", async (req, res, next) => {
  try {
    const mongoQuery = q2m(req.query);

    console.log(mongoQuery.criteria);

    // const cards = await cardSchema.find(mongoQuery.criteria);
    // res.send(cards);
  } catch (err) {
    next(err);
  }
});

export default searchRouter;
