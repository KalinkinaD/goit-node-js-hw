const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    email: { type: String, require: true },
    password: { type: String, require: true },
    avatarURL: {
      type: String,
      required: true,
    },
    subscription: {
      type: String,
      enum: ["free", "pro", "premium"],
      default: "free",
    },
    token: String,
    verificationToken: { type: String, default: "", required: false },
  },
  { versionKey: false },
);

module.exports = mongoose.model("User", UserSchema);
