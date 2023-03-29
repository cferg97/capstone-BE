import express from "express";
import { activeCheckMiddleware } from "../../lib/auth/activeCheck.js";
import { JWTAuthMiddleware } from "../../lib/auth/jwtAuth.js";
import reviewModel from "./model.js";

const reviewRouter = express.Router();

reviewRouter.get("/:sellername", async (req, res, next) => {
  try {
    const reviews = await reviewModel
      .find({ seller: req.params.sellername })
      .populate({
        path: "reviewer",
        select: "-_id username"
      });
    res.send(reviews);
  } catch (err) {
    next(err);
  }
});

reviewRouter.post(
  "/:sellername",
  JWTAuthMiddleware,
  activeCheckMiddleware,
  async (req, res, next) => {
    try {
      const newReview = new reviewModel({
        seller: req.params.sellername,
        reviewer: req.user._id,
        ...req.body,
      });
      await newReview.save();
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
);

export default reviewRouter;
