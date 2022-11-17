const { json } = require("express");
const express = require("express");
const {
  getCategories,
  getReviews,
  getReviews_byID,
  getCommentsByReview,
  postComment,
  patchReview,
  getUsers,
  getEndpoints,
  deleteComment,
} = require("./controllers/games.controllers.js");

const app = express();
app.use(express.json())

app.get('/api', getEndpoints)

app.get("/api/categories", getCategories);
app.get('/api/reviews', getReviews)
app.get("/api/reviews/:review_id", getReviews_byID);
app.get('/api/reviews/:review_id/comments', getCommentsByReview)

app.post('/api/reviews/:review_id/comments', postComment)
app.patch('/api/reviews/:review_id', patchReview)

app.get('/api/users', getUsers)

app.delete('/api/comments/:comment_id', deleteComment)

app.use((err, req, res, next) => {
    if (err.code === "22P02" ) {
      res.status(400).send({ msg: "Invalid parameter" });
    } else {
      next(err);
    }
  });

  app.use((err, req, res, next) => {
    if (err.code === '23503' ) {
      res.status(400).send({ msg: "Bad request: Referenced parameter does not exist" });
    } else {
      next(err);
    }
  });

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
    console.log(err);
    res.sendStatus(500);
  });

app.all("/*", (req, res) => {
  res.status(404).send({ msg: "Route not found" });
});

module.exports = app;

