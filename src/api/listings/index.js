import mongoose, { mongo } from "mongoose";
import listingsModel from "./model.js";
import cardModel from "../search/model.js";
import express from "express";
import q2m from "query-to-mongo";
import { JWTAuthMiddleware } from "../../lib/auth/jwtAuth.js";

const listingsRouter = express.Router();

listingsRouter.get("/", async (req, res, next) => {
  try {
    let ids = [];
    let imgUrls = [];
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

// listingsRouter.get("/images/:id", async (req, res, next) => {
//   try {
//     let cardImg = await cardModel
//       .findOne({ cardmarket_id: req.params.id })
//       .select("-_id image_uris");
//     res.send({ image: cardImg.image_uris.normal });
//   } catch (err) {
//     next(err);
//   }
// });

export default listingsRouter;
