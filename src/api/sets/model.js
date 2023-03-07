import mongoose from "mongoose";

const { Schema, model } = mongoose;

const setSchema = new Schema({
  baseSetSize: { type: Number },
  code: { type: String },
  isFoilOnly: { type: Boolean },
  isOnlineOnly: { type: Boolean },
  keyruneCode: { type: String },
  languages: { type: Array },
  name: { type: String },
  releaseDate: { type: String },
  totalSetSize: { type: Number },
  translations: { type: Object },
  type: { type: String },
});

export default model("sets", setSchema);
