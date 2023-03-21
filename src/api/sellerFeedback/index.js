import express from "express";
import reviewModel from "./model.js";

const reviewRouter = express.Router();

reviewRouter.get("/:userid", async (req, res, next) => {
  try {
    const reviews = await reviewModel.find({ sellerId: req.params.userid });
    res.send(reviews);
  } catch (err) {
    next(err);
  }
});

reviewRouter.post("/:userid", async (req, res, next) => {
  try {
    const newReview = new reviewModel({
      ...req.body,
      sellerId: req.params.userid,
    });
    await newReview.save();
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

export default reviewRouter;
