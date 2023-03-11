import mongoose, { mongo } from "mongoose";
import listingsModel from "./model.js";
import cardModel from "../search/model.js";
import express from "express";
import q2m from "query-to-mongo";
import { JWTAuthMiddleware } from "../../lib/auth/jwtAuth.js";

const listingsRouter = express.Router();

listingsRouter.get("/", async (req, res, next) => {
  try {
    const mongoQuery = q2m(req.query);
    const { total, products } = await listingsModel.pagination(mongoQuery);

    res.send({
      links: mongoQuery.links("http://localhost:3001/sell", total),
      total,
      totalPages: Math.ceil(total / mongoQuery.options.limit),
      products,
    });
  } catch (err) {
    next(err);
  }
});

listingsRouter.get("/:id", async (req, res, next) => {
  try {
    let cards = await listingsModel.find({ cardmarketId: req.params.id.toString() });
    if (cards) {
      res.send(cards);
    }
  } catch (err) {
    next(err);
  }
});

export default listingsRouter;
