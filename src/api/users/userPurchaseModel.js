import mongoose from "mongoose";

const { model, Schema } = mongoose;

const userPurchaseModel = new Schema({
    userId: {type: Schema.Types.ObjectId, ref: "users"},
  purchases: {
    total: { type: Number, default: 0 },
    notPaidOrders: { type: Number, default: 0 },
    notReceived: { type: Number, default: 0 },
  },
  sales: {
    total: { type: Number, default: 0 },
    notSentOrders: { type: Number, default: 0 },
    notArrived: { type: Number, default: 0 },
  },
});

export default model("userPurchaseDetails", userPurchaseModel);
