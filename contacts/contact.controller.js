const Joi = require("joi");
const {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
} = require("./contacts");

module.exports = class ContactController {
  static async getUsers(req, res, next) {
    const userList = await listContacts();
    return res.status(200).json(userList);
  }

  static getUserById(req, res, next) {
    return res.status(200).json(getContactById(req.params.id));
  }

  static async addUser(req, res, next) {
    await addContact(req.body.name, req.body.email, req.bode.phone);
    const newUser = await listContacts();
    return res.status(201).json(newUser[newUser.length - 1]);
  }

  static async deleteUser(req, res, next) {
    await removeContact(req.params.id);
    return res.status(200).json({ message: "Contact is deleted" });
  }

  static async updateUser(req, res, next) {
    await updateContact(req.params.id, req.body);
    return res.status(200).json(getContactById(req.params.id));
  }

  static validateCreateUser(req, res, next) {
    const createUserRules = Joi.object({
      name: Joi.string().required(),
      email: Joi.string().required(),
      phone: Joi.string().required(),
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
    });
    const validationResult = updateUserRules.validate(req.body);
    if (validationResult.error) {
      return res.status(400).send(validationResult.error.details);
    }
    next();
  }

  static async checkUserInList(req, res, next) {
    const userList = await listContacts();
    const targetUserIndex = userList.findIndex(
      (user) => (user.id = req.params.id)
    );
    if (targetUserIndex === -1) {
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
