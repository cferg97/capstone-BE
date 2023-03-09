import express from "express";
import mongoose from "mongoose";
import q2m from "query-to-mongo";
import cardSchema from "./model.js";

const searchRouter = express.Router();

searchRouter.get("/", async (req, res, next) => {
  try {
    const mongoQuery = q2m(req.query);
    
    const { total, products } = await cardSchema.pagination(mongoQuery);
    res.send({
      links: mongoQuery.links("http://localhost:3001/search", total),
      total,
      totalPages: Math.ceil(total / mongoQuery.options.limit),
      products,
    });
  } catch (err) {
    next(err);
  }
});

export default searchRouter;
