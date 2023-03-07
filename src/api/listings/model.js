import mongoose from "mongoose";

const { model, Schema } = mongoose;

const listingsSchema = new Schema(
  {
    sellerId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    cardmarketId: { type: Schema.Types.Number, required: false, },
    quantity: { type: Number, required: true },
    name: { type: String, required: true },
    cn: { type: Number, required: true },
    condition: { type: String, required: true },
    language: { type: String, required: true },
    price: { type: Number, required: true },
    rarity: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

export default model("listing", listingsSchema);
