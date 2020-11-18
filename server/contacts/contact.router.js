const express = require("express");
const ContactController = require("./contact.controller");
const router = express.Router();

router.get("/", ContactController.getOptionalList, ContactController.getUsers);

router.post(
  "/",
  ContactController.validateCreateUser,
  ContactController.addUser
);

router.patch(
  "/:id",
  ContactController.checkUserInList,
  ContactController.checkDataExist,
  ContactController.validateUpdateUser,
  ContactController.updateUser
);

router.get(
  "/:id",
  ContactController.checkUserInList,
  ContactController.getUserById
);

router.delete(
  "/:id",
  ContactController.checkUserInList,
  ContactController.deleteUser
);

module.exports = router;
