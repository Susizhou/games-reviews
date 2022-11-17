const { getCategories } = require("../controllers/games.controllers");

const categoriesRouter = require("express").Router();

categoriesRouter.route("/").get(getCategories);

module.exports = categoriesRouter;
