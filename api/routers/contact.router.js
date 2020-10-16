const express = require("express");
const ContactController = require("../controllers/contact.controller");

const router = express.Router();

//get contact list
router.get("/", ContactController.getUsers);

// create new contact and add it to the list
router.post(
  "/",
  ContactController.validateCreateUser,
  ContactController.addUser
);

//update Info about existed contact
router.patch(
  "/:id",
  ContactController.checkUserInList,
  ContactController.checkDataExist,
  ContactController.validateUpdateUser,
  ContactController.updateUser
);

//find contact by ID
router.get(
  "/:id",
  ContactController.checkUserInList,
  ContactController.getUserById
);

//delete contact by id
router.delete(
  "/:id",
  ContactController.checkDataExist,
  ContactController.deleteUser
);

module.exports = router;
