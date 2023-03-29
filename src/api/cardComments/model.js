import mongoose from "mongoose";

const { Schema, model } = mongoose;

const cardCommentSchema = new Schema({
  cardmarketId: { type: String, required: true },
  posterId: { type: Schema.Types.ObjectId, ref: "users", required: true },
  text: { type: String, required: true },
});

export default model("cardComments", cardCommentSchema);
