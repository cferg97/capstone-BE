import express from "express";
import { activeCheckMiddleware } from "../../lib/auth/activeCheck.js";
import { JWTAuthMiddleware } from "../../lib/auth/jwtAuth.js";
import reviewModel from "./model.js";

const reviewRouter = express.Router();

reviewRouter.get("/:userid", async (req, res, next) => {
  try {
    const reviews = await reviewModel
      .find({ sellerId: req.params.userid })
      .populate({
        path: "sellerId",
        select: "username -_id",
      })
      .populate({
        path: "reviewerId",
        select: "username -_id",
      });
    res.send(reviews);
  } catch (err) {
    next(err);
  }
});

reviewRouter.post(
  "/:userid",
  JWTAuthMiddleware,
  activeCheckMiddleware,
  async (req, res, next) => {
    try {
      const newReview = new reviewModel({
        ...req.body,
        sellerId: req.params.userid,
        reviewerId: req.user._id,
      });
      await newReview.save();
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
);

export default reviewRouter;
