const Joi = require("joi");
const bcrpt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("./UsersSchema");
const { findUser, hashPassword, updateToken } = require("./users.helpers");

require("dotenv").config();

module.exports = class UserController {
  static async register(req, res, next) {
    try {
      const { email, password } = req.body;
      const userExist = await findUser(email);
      if (!userExist) {
        const newUser = await User.create({
          email,
          password: await hashPassword(password),
        });
        return res.status(201).json({
          user: {
            email: newUser.email,
            subscription: newUser.subscription,
          },
        });
      }
      return res.status(409).json({ message: "Email in use" });
    } catch (err) {
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
        expiresIn: 2 * 24 * 60 * 60,
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
      const findU = await User.findByIdAndUpdate(
        _id,
        {
          $set: {
            token: "",
          },
        },
        {
          new: true,
        }
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
      const user = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      return res.status(200).json({
        email: user.email,
        subscription: user.subscription,
      });
    } catch (err) {
      next(err);
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
};
