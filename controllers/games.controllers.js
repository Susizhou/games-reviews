const { fetchCategories, fetchReviews, fetchReviewsByID, fetchCommentsByReview } = require("../models/games.models");

exports.getCategories = (req, res) => {
  fetchCategories().then((categories) => {
    res.status(200).send({ categories });
  });
};

exports.getReviews = (req, res, next) => {
  fetchReviews()
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviews_byID = (req, res, next) => {
  const { review_id } = req.params;
  fetchReviewsByID(review_id)
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getCommentsByReview = (req, res, next) => {
  const { review_id } = req.params;
  fetchCommentsByReview(review_id).then((comments) => {
    res.status(200).send({ comments });
  }).catch((err)=>{
    next(err)
  });
};