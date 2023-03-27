import express from "express";
import commentModel from "./model.js";
import { JWTAuthMiddleware } from "../../lib/auth/jwtAuth.js";
import { activeCheckMiddleware } from "../../lib/auth/activeCheck.js";

const commentRouter = express.Router();

commentRouter.get("/:cardId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const reviews = await commentModel.find({ cardmarketId: req.params.cardId }).populate({
        path: "posterId",
        select: "username -_id"
    });
    res.send(reviews);
  } catch (err) {
    next(err);
  }
});

commentRouter.post(
  "/:cardId",
  JWTAuthMiddleware,
  activeCheckMiddleware,
  async (req, res, next) => {
    try {
      const newComment = new commentModel({
        comment: req.body.comment,
        cardmarketId: req.params.cardId,
        posterId: req.user._id,
      });
      await newComment.save();
      res.status(201).send();
    } catch (err) {
      next(err);
    }
  }
);

export default commentRouter;
