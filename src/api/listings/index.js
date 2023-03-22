import mongoose, { mongo } from "mongoose";
import listingsModel from "./model.js";
import cardModel from "../search/model.js";
import express from "express";
import q2m from "query-to-mongo";
import { JWTAuthMiddleware } from "../../lib/auth/jwtAuth.js";
import { activeCheckMiddleware } from "../../lib/auth/activeCheck.js";

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

listingsRouter.post(
  "/:itemid",
  JWTAuthMiddleware,
  activeCheckMiddleware,
  async (req, res, next) => {
    try {
      const card = cardModel.find({ cardmarket_id: req.params.itemid });
      const newListing = new listingsModel({
        ...req.body,
        name: card.name,
        sellerId: req.user._id,
        cardmarketId: req.params.itemid,
        cn: card.collector_number,
        rarity: card.rarity,
      });
      await newListing.save();
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
);

listingsRouter.get("/:id", async (req, res, next) => {
  try {
    let cards = await listingsModel
      .find({ cardmarketId: req.params.id.toString() })
      .populate({
        path: "sellerId",
        select: "-_id username country",
      });
    if (cards) {
      res.send(cards);
    }
  } catch (err) {
    next(err);
  }
});

export default listingsRouter;
