const bcrypt = require("bcrypt");
const UsersSchema = require("./users.schema");
const saltRounds = 8;
const multer = require("multer");
const imagemin = require("imagemin");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminPngquant = require("imagemin-pngquant");
const { promises: fsPromises } = require("fs");
const path = require("path");

async function findUser(email) {
  return await UsersSchema.findOne({ email });
}
async function hashPassword(password) {
  return await bcrypt.hash(password, saltRounds);
}
async function updateToken(id, newToken) {
  return await UsersSchema.findByIdAndUpdate(id, { token: newToken });
}

//Middleware for avatar
const storage = multer.diskStorage({
  destination: "tmp",
  filename: function (req, file, cb) {
    const ext = path.parse(file.originalname).ext;
    cb(null, file.fieldname + "-" + Date.now() + ext);
  },
});
const upload = multer({ storage });

async function minifyImage(req, res, next) {
  try {
    console.log("Start processing file...");
    const MINIFIED_DIR = "public/images";
    await imagemin([req.file.destination], {
      destination: MINIFIED_DIR,
      plugins: [
        imageminJpegtran(),
        imageminPngquant({
          quality: [0.6, 0.8],
        }),
      ],
    });
    const { filename, path: draftPath } = req.file;
    await fsPromises.unlink(draftPath);
    req.file = {
      ...req.file,
      path: path.join(MINIFIED_DIR, filename),
      destination: MINIFIED_DIR,
    };
    next();
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  upload,
  hashPassword,
  findUser,
  updateToken,
  minifyImage,
};