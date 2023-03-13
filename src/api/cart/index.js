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
      const cart = await cartModel.find({ userId: req.user._id }).populate({
        path: "userId",
        select: "-userActivity -createdAt -active",
      });
      if (cart.length > 0) {
        res.send(cart);
      } else {
        const newCart = new cartModel({ userId: req.user._id });
        const userCart = await (
          await newCart.save()
        ).populate({
          path: "userId",
          select: "-userActivity -createdAt -active",
        });
        res.send({ userCart });
      }
    } catch (err) {
      next(err);
    }
  }
);

cartRouter.put("/:itemid", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const item = await listingsModel.find({ cardmarketId: req.params.itemid });
    const itemId = await item._id;
    console.log(item);
    const {_id} = await cartModel.findOneAndUpdate(
      { userId: req.user._id },
      { new: true, runValidators: true }
    );
    if (_id) {
      await cartModel.findByIdAndUpdate(_id, {
        $push: { items: itemId },
      });
      res.status(201).send();
    }
    
  } catch (err) {
    next(err);
  }
});

export default cartRouter;
