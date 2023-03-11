import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const usersSchema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    street: { type: String, required: true },
    zip: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    active: { type: Boolean, default: false, required: true },
    userActivity: {
      type: Schema.Types.ObjectId,
      ref: "userPurchaseDetails",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

usersSchema.pre("save", async function (next) {
  const currentUser = this;
  if (currentUser.isModified("password")) {
    const plainPW = currentUser.password;
    const hash = await bcrypt.hash(plainPW, 11);
    currentUser.password = hash;
  }
  next();
});

usersSchema.methods.toJSON = function () {
  const userDoc = this;
  const user = userDoc.toObject();

  delete user.password;
  delete user.updatedAt;
  delete user.__v;
  return user;
};

usersSchema.static("checkCredentials", async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      return user;
    } else {
      return null;
    }
  } else {
    return null;
  }
});

usersSchema.static("pagination", async function (query) {
  const total = await this.countDocuments(query.criteria);

  const users = await this.find(query.criteria, query.options.fields)
    .skip(query.options.skip)
    .limit(query.options.limit)
    .sort(query.options.sort)
    .populate({
      path: "userActivity",
      select: "purchases sales -_id",
    });

  return { total, users };
});

export default model("users", usersSchema);
