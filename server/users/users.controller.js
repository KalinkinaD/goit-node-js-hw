const Joi = require("joi");
const bcrpt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { generateFromString } = require("generate-avatar");
const User = require("./users.schema");
const { findUser, hashPassword, updateToken } = require("./users.helpers");

require("dotenv").config();

module.exports = class UserController {
  static async register(req, res, next) {
    try {
      const { email, password } = req.body;
      const userExist = await User.findOne({ email });
      if (userExist) {
        return res.status(409).send("Email in use");
      }
      const avatarURL = "http://localhost:3000/images/" + req.file.filename;
      const newUser = await User.create({
        email,
        password: await hashPassword(password),
        avatarURL,
      });
      return res.status(201).send({
        user: {
          email: newUser.email,
          subscription: newUser.subscription,
        },
      });
    } catch (err) {
      console.log(err);
      next(err);
    }
  }
  static async login(req, res, next) {
    try {
      const { email, password, id } = req.body;
      const user = await findUser(email);
      if (!user) {
        return res.status(401).json({ message: "Email or password is wrong" });
      }
      const passwordValidation = await bcrpt.compare(password, user.password);
      if (!passwordValidation) {
        return res.status(401).json({ message: "Email or password is wrong" });
      }
      const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
      updateToken(user._id, token);
      return res.status(200).json({
        token: token,
        user: {
          email: user.email,
          subscription: user.subscription,
        },
      });
    } catch (err) {
      next(err);
    }
  }
  static async logout(req, res, next) {
    try {
      const { _id } = req.user;
      await User.findByIdAndUpdate(
        _id,
        {
          $set: {
            token: "",
          },
        },
        {
          new: true,
        },
      );
      return res.status(204).send("No Content");
    } catch (err) {
      next(err);
    }
  }
  static async getCurrent(req, res, next) {
    try {
      const user = req.user;
      return res.status(200).json({
        email: user.email,
        subscription: user.subscription,
        avatarURL: user.avatarURL,
      });
    } catch (err) {
      next(err);
    }
  }
  static async validate(req, res, next) {
    const validationSchema = Joi.object({
      email: Joi.string().required(),
      password: Joi.string().required(),
    });
    const validationResult = validationSchema.validate(req.body);
    if (validationResult.error) {
      return res.status(400).send(validationResult.error.details);
    }
    next();
  }
  static async updateCurrent(req, res, next) {
    try {
      const user = req.user;
      const newAvatarUrl = "http://localhost:3000/images/" + req.file.filename;
      await User.findByIdAndUpdate(
        user._id,
        {
          avatarURL: newAvatarUrl,
        },
        {
          new: true,
        }
      );
      res.status(200).json(`avatarURL: ${avatarURL}`)
      next();
    } catch (err) {
      res.status(500).send(err.message);
    }
  }
  static async authorize(req, res, next) {
    try {
      const authorizationHeader = req.get("Authorization") || "";
      const token = authorizationHeader.replace("Bearer ", "");
      let userId;
      try {
        userId = await jwt.verify(token, process.env.JWT_SECRET).id;
      } catch (err) {
        return res.status(401).json({ message: "Not authorized" });
      }
      const user = await User.findById(userId);
      if (!user || user.token !== token) {
        return res.status(401).json({ message: "Not authorized" });
      }
      req.user = user;
      req.token = token;
      next();
    } catch (err) {
      next(err);
    }
  }
  static async createAvatarURL(req, res, next) {
    if (req.file) {
      return next();
    }
    try {
      const randomAtribut = (Math.random() * (100 - 10) + 100).toString();
      const pathFolderTmp = "tmp";
      const dataAvatar = await generateFromString(randomAtribut);
      const filename = `avatar-${Date.now()}.svg`;
      await fsPromises.writeFile(pathFolderTmp + "/" + filename, dataAvatar);

      req.file = {
        destination: pathFolderTmp,
        filename,
        path: path.join(pathFolderTmp + "/" + filename),
      };
      next();
    } catch (error) {
      console.log(error);
    }
  }
  static subscrType(req, res, next) {
    const createSubscrRules = Joi.object({
      subscription: Joi.string().valid("free", "pro", "premium"),
    });
    const result = createSubscrRules.validate(req.body);
    if (result.error) {
      return res.status(400).send(result.error.details);
    }
    next();
  }
};
