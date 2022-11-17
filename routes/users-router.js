const { getUsers, getUserbyUsername } = require("../controllers/games.controllers");

const userRouter = require("express").Router();

userRouter.route("/").get(getUsers);
userRouter.route("/:username").get(getUserbyUsername)

module.exports = userRouter;
