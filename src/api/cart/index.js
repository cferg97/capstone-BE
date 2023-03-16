import express from "express";
import createHttpError from "http-errors";
import cartModel from "./model.js";
import listingsModel from "../listings/model.js";
import { JWTAuthMiddleware } from "../../lib/auth/jwtAuth.js";
import { activeCheckMiddleware } from "../../lib/auth/activeCheck.js";

const cartRouter = express.Router();

//get cart => if exists, fetch, if not exist, create then fetch
//carts expire after 1 hour

cartRouter.get(
  "/",
  JWTAuthMiddleware,
  activeCheckMiddleware,
  async (req, res, next) => {
    try {
      const cart = await cartModel
        .find({ userId: req.user._id })
        .populate({
          path: "userId",
          select: "_id",
        })
        .populate({
          path: "cart.items",
          populate: {
            path: "listingId",
            select: "_id",
          },
          populate: {
            path: "seller",
            select: "username -_id",
          },
        });
      if (cart.length > 0) {
        res.send(cart[0].cart);
      } else {
        const newCart = new cartModel({ userId: req.user._id });
        const {userCart}= await newCart.save();

         
        // .populate({
        //   path: "userId",
        //   select: "-userActivity -createdAt -active",
        // })
        // .populate({
        //   path: "items",
        //   select: "-quantity",
        // });
        res.send(userCart);
      }
    } catch (err) {
      next(err);
    }
  }
);

cartRouter.put("/:itemid", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const item = await listingsModel.findOne({
      cardmarketId: req.params.itemid,
    });

    const updatedCart = await cartModel.findOneAndUpdate(
      { userId: req.user._id },
      {
        $push: {
          "cart.items": {
            listingId: item._id,
            itemId: item.cardmarketId,
            name: item.name,
            seller: item.sellerId,
            condition: item.condition,
            price: item.price,
            quantity: 1,
          },
        },
      },
      { new: true, upsert: true }
    );
    if (updatedCart) {
      res.status(204).send();
    }
  } catch (err) {
    next(err);
  }
});

cartRouter.delete("/:itemid", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const cart = await cartModel.findOneAndUpdate(
      { userId: req.user._id },
      {
        $pull: { "cart.items": { itemId: req.params.itemid } },
      }
    );
    if (cart) {
      res.status(204).send();
    }
  } catch (err) {
    next(err);
  }
});

export default cartRouter;
