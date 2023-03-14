import mongoose from "mongoose";

const { Schema, model } = mongoose;

const cartSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    items: [{ type: Schema.Types.ObjectId, ref: "listing" }],
  },
  {
    timestamps: true,
  }
);

export default model("userCarts", cartSchema);
