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
//---------- Router ------------------------
const app = express();

const apiRouter = require('./routes/api-router.js');

app.use(express.json())
app.use('/api', apiRouter);


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

