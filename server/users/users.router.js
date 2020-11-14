const { Router } = require("express");
const UserController = require("./users.controller");
const UserHelpers = require("./users.helpers");
const usersRouter = Router();

//User Registration
usersRouter.post(
  "/users/register",
  UserController.validate,
  UserHelpers.upload.single('avatar'),
  UserController.createAvatarURL,
  UserHelpers.minifyImage,
  UserController.register,
);

//User LogIn
usersRouter.post("/users/login", UserController.validate, UserController.login);

//User LogOut
usersRouter.post(
  "/users/logout",
  UserController.authorize,
  UserController.logout,
);

//Get current user
usersRouter.get(
  "/users/current",
  UserController.authorize,
  UserController.getCurrent,
);

//Update information in user
usersRouter.patch(
  "/users/:id",
  UserController.authorize,
  UserController.updateCurrent,
);

usersRouter.patch(
  "/users/avatar",
  UserController.authorize,
  UserHelpers.upload.single("avatar"),
  UserHelpers.minifyImage,
  UserController.updateCurrent,
);

module.exports = usersRouter;