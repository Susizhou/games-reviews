const db = require("../db/connection.js");

exports.fetchCategories = () => {
  return db.query("SELECT * FROM categories").then((categories) => {
    return categories.rows;
  });
};

exports.fetchReviews = () => {
  return db
    .query(
      "SELECT owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, designer, COUNT(comment_id) AS comment_count FROM reviews\
    LEFT JOIN comments ON comments.review_id = reviews.review_id\
    GROUP BY reviews.review_id\
    ORDER BY reviews.created_at DESC;"
    )
    .then((reviews) => {
      return reviews.rows;
    });
};

exports.fetchReviewsByID = (review_id) => {
  return db
    .query(
      `SELECT reviews.review_id, title, review_body, designer, review_img_url, reviews.votes, category, owner, reviews.created_at, COUNT(comment_id) AS comment_count FROM reviews\
      LEFT JOIN comments ON comments.review_id = reviews.review_id
      WHERE reviews.review_id = $1
      GROUP BY reviews.review_id;`,
      [review_id]
    )
    .then((review) => {
      if (review.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "ID does not exist" });
      }
      return review.rows[0];
    });
};

exports.fetchCommentsByReview = (review_id) => {
  return this.fetchReviewsByID(review_id)
    .then(() => {
      return db.query(
        "SELECT * FROM comments\
        WHERE review_id = $1\
        ORDER BY CREATED_AT DESC",
        [review_id]
      );
    })
    .then((comments) => {
      return comments.rows;
    });
};

exports.addComment = (review_id, body_req) => {
  const { body, author } = body_req;
  const created_at = new Date();

  if (!body || !author) {
    return Promise.reject({
      status: 400,
      msg: "Input data format was not correct",
    });
  }

  return db
    .query(
      `
        INSERT INTO comments 
        (body, author, review_id, votes , created_at)
        VALUES 
        ($1,$2,$3,$4,$5)
        RETURNING *;
    `,
      [body, author, review_id, 0, created_at]
    )
    .then((comment) => {
      return comment.rows[0];
    });
};

exports.updateReview = (review_id, body) => {
  const { inc_votes } = body;

  if (!inc_votes) {
    return Promise.reject({
      status: 400,
      msg: "Input data format was not correct",
    });
  }
  return this.fetchReviewsByID(review_id).then(()=>{
    return db.query(
        `
        UPDATE reviews 
        SET votes = votes + $1
        WHERE review_id = $2
        RETURNING *;
        `,
        [inc_votes, review_id]
      )
  }).then((review)=>{
    return review.rows[0]
  });
};


exports.fetchUsers = ()=>{
    return db.query(`
    SELECT * FROM users;
    `).then((users)=>{
        return users.rows
    })
}