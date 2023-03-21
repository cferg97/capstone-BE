import mongoose from "mongoose";

const { Schema, model } = mongoose;

const reviewSchema = new Schema(
  {
    sellerId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    itemConditionRating: { type: Number, min: 1, max: 5, required: true },
    postageRating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true },
    reviewerId: { type: Schema.Types.ObjectId, ref: "users", required: true },
  },
  { timestamps: true }
);

export default model("sellerReviews", reviewSchema);
