const {
  fetchCategories,
  fetchReviews,
  fetchReviewsByID,
  fetchCommentsByReview,
  addComment,
  updateReview,
  fetchUsers,
  removeComment,
} = require("../models/games.models");

const { readFile } =  require('fs/promises')

exports.getCategories = (req, res) => {
  fetchCategories().then((categories) => {
    res.status(200).send({ categories });
  });
};

exports.getReviews = (req, res, next) => {
  const QueryObj = req.query;
  fetchReviews(QueryObj)
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
  fetchCommentsByReview(review_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const { review_id } = req.params;
  const body = req.body;
  addComment(review_id, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchReview = (req, res, next) => {
  const { review_id } = req.params;
  const body = req.body;

  updateReview(review_id, body)
    .then((review) => {
      res.status(201).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsers = (req, res, next) => {
  fetchUsers()
    .then((users) => {
      res.send({ users });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteComment = (req, res, next) => {
  const {comment_id} = req.params;
  removeComment(comment_id).then(()=>{
    res.status(204).send()
  }).catch((err) =>{
    next(err)
  })
}

exports.getEndpoints = (req, res, next) => {
  readFile("/Users/susanazhou/Desktop/northcoders/backend/be-nc-games/endpoints.json")
    .then((endpoints) => {
       res.send({endpoints: JSON.parse(endpoints)}) 
    })
};