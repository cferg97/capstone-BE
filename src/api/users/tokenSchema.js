import mongoose from "mongoose";

const { Schema, model } = mongoose;

const tokenSchema = new Schema({
  _userId: { type: Schema.Types.ObjectId, required: true, ref: "users" },
  token: { type: String, required: true },
  expireAt: {
    type: Date,
    default: Date.now,
    index: { expires: 3600000 },
  },
});

export default model("tokens", tokenSchema);
