const bcrypt = require("bcrypt");
const UsersSchema = require("./UsersSchema");
const saltRounds = 1;

async function findUser(email) {
    return await UsersSchema.findOne({ email });
  }
async function hashPassword(password) {
    return await bcrypt.hash(password, saltRounds);
  }
async function updateToken(id, newToken) {
    return await UsersSchema.findByIdAndUpdate(id, { token: newToken });
  }

module.exports = {
    hashPassword,
    findUser,
    updateToken,
  };