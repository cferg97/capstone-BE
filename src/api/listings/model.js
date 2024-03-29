import mongoose from "mongoose";
import cardModel from "../search/model.js";

const { model, Schema } = mongoose;

const listingsSchema = new Schema(
  {
    sellerId: { type: Schema.Types.ObjectId, ref: "users", required: true },
    cardmarketId: { type: Number, required: true },
    quantity: { type: Number, required: true },
    name: { type: String, required: true },
    cn: { type: Number, required: true },
    condition: { type: String, required: true },
    language: { type: String, required: true },
    price: { type: Number, min: 0.01, required: true },
    rarity: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

listingsSchema.static("pagination", async function (query) {
  const total = await this.countDocuments(query.criteria);
  const products = await this.find(query.criteria, query.options.fields)
    .skip(query.options.skip)
    .limit(query.options.limit)
    .sort(query.options.sort)
    .populate({ 
      path: "sellerId",
      select: "username -_id",
    });
  return { total, products };
});

export default model("listing", listingsSchema);
