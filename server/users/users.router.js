const { Router } = require("express");
const UserController = require("./users.controller");
const usersRouter = Router();

//User Registration
usersRouter.post(
    "/auth/register",
    UserController.validate,
    UserController.register
);

//User LogIn
usersRouter.post(
    "/auth/login",
    UserController.validate,
    UserController.login
);

//User LogOut
usersRouter.post(
    "/auth/logout",
    UserController.authorize,
    UserController.logout
)

//Get current user
usersRouter.get(
    "/users/current",
    UserController.authorize,
    UserController.getCurrent
)

//Update information in user
usersRouter.patch(
    "/users/:id",
    UserController.authorize,
    UserController.updateCurrent
)

module.exports = usersRouter;