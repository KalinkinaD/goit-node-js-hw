const mongoose = require('mongoose');
const { Schema } = mongoose

const UserSchema = new Schema({
    email: { type: String,
        require: true, },
    password: { type: String,
        require: true, },
    subscription: {
      type: String,
      enum: ["free", "pro", "premium"],
      default: "free"
    },
    token: String  
})

module.exports = mongoose.model('User', UserSchema);