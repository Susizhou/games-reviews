const {
  getReviews,
  getReviews_byID,
  patchReview,
  getCommentsByReview,
  postComment,
} = require("../controllers/games.controllers");

// users-router.js
const reviewRouter = require("express").Router();

reviewRouter.route("/").get(getReviews);

reviewRouter.route("/:review_id").get(getReviews_byID).patch(patchReview);

reviewRouter.route("/:review_id/comments").get(getCommentsByReview).post(postComment);
module.exports = reviewRouter;
