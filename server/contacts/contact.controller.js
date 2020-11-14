const Joi = require("joi");
const contactModel = require("./contact.schema");
const {
  Types: { ObjectId },
} = require("mongoose");

const options = {
  page: 1,
  limit: 4,
  collation: {
    subscription: "free",
  },
};

module.exports = class ContactController {
  static async getUsers(req, res, next) {
    try {
      const contacts = await contactModel.find();
      return res.status(200).json(contacts);
    } catch (err) {
      next(err);
    }
  }

  static async getOptionalList(req, res, next) {
    try {
      const { limit, page, sub } = req.query;
      if (limit && page) {
        const options = { limit, page };
        const contacts = await contactModel.paginate({}, options);
        return res.status(200).json(contacts.docs);
      }
      if (sub) {
        const query = { subscription: sub };
        const options = { limit: 20, page: 1 };
        const contacts = await contactModel.paginate(query, options);
        return res.status(200).json(contacts.docs);
      }
      next();
    } catch (err) {
      next(err);
    }
  }

  static async getUserById(req, res, next) {
    try {
      const contact = await contactModel.findById(req.params.id);
      if (!contact) {
        return res.status(404).json({ message: "Cannot find contact" });
      }
      return res.status(200).json(contact);
    } catch (err) {
      next(err);
    }
  }

  static async addUser(req, res, next) {
    try {
      const contact = await contactModel.create(req.body);
      return res.status(201).json(contact);
    } catch (err) {
      next(err);
    }
  }

  static async deleteUser(req, res, next) {
    try {
      const contact = await contactModel.findByIdAndDelete(req.params.id);
      if (!contact) {
        return res.status(404).json({ message: "Cannot find such contact" });
      }
      return res.status(200).json({ message: "Contact is deleted" });
    } catch (err) {
      next(err);
    }
  }

  static async updateUser(req, res, next) {
    try {
      const contact = await contactModel.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      if (!contact) {
        return res.status(404).json({ message: "Cannot found this contact" });
      }
      return res.status(200).json(contact);
    } catch (err) {
      next(err);
    }
  }

  static validateCreateUser(req, res, next) {
    const createUserRules = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
      subscription: Joi.string().required(),
      password: Joi.string().required(),
      token: Joi.string(),
    });
    const validationResult = createUserRules.validate(req.body);
    if (validationResult.error) {
      return res.status(400).send(validationResult.error.details);
    }
    next();
  }

  static validateUpdateUser(req, res, next) {
    const updateUserRules = Joi.object({
      name: Joi.string(),
      email: Joi.string(),
      phone: Joi.string(),
      subscription: Joi.string(),
      password: Joi.string(),
      token: Joi.string(),
    });
    const validationResult = updateUserRules.validate(req.body);
    if (validationResult.error) {
      return res.status(400).send(validationResult.error.details);
    }
    next();
  }

  static async checkUserInList(req, res, next) {
    if (!ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Not found :(" });
    }
    next();
  }

  static checkDataExist(req, res, next) {
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "missing fields" });
    }
    next();
  }
};
