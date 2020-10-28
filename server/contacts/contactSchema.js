const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    subscription: { type: String, required: true },
    password: { type: String, required: true },
    token: { type: String, required: false, default: "" },
  },
  { versionKey: false }
);

const contactModel = mongoose.model("contacts", userSchema);

module.exports = contactModel;
