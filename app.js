const express = require("express");
const {
  getCategories,
  getReviews,
  getReviews_byID,
} = require("./controllers/games.controllers.js");

const app = express();

app.get("/api/categories", getCategories);
app.get('/api/reviews', getReviews)
app.get("/api/reviews/:review_id", getReviews_byID);

app.use((err, req, res, next) => {
    if (err.code === "22P02") {
      res.status(400).send({ msg: "Invalid parameter" });
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

