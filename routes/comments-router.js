const { deleteComment, patchComment } = require('../controllers/games.controllers');

// users-router.js
const commentRouter = require('express').Router();

commentRouter.route("/:comment_id").delete(deleteComment).patch(patchComment);


module.exports = commentRouter;