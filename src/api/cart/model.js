import mongoose from "mongoose";

const { Schema, model } = mongoose;

const cartSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    cart: {
      items: [
        {
          listingId: {
            type: Schema.Types.ObjectId,
            ref: "listing",
            required: true,
          },
          itemId: { type: Number, required: true },
          name: { type: String, required: true },
          seller: { type: Schema.Types.ObjectId, ref: "users", required: true },
          condition: { type: String, required: true },
          price: { type: Number, required: true },
          quantity: { type: Number, default: 0, required: true },
        },
      ],
    },
  },
  {
    timestamps: true,
  }
);

export default model("userCarts", cartSchema);
