const db = require("../db/connection.js");

exports.fetchCategories = () => {
  return db.query("SELECT * FROM categories").then((categories) => {
    return categories.rows;
  });
};

exports.fetchReviews = (queryObj) => {
  if (Object.keys(queryObj).length !== 0) {
    const possQuery = ["order", "sort_by", "category", 'limit', 'p'];

    const isValidQuery = Object.keys(queryObj).every((key) =>
      possQuery.includes(key)
    );
    if (!isValidQuery) {
      return Promise.reject({ status: 400, msg: "Invalid query" });
    }
  }

  let { order, sort_by, category, limit, p } = queryObj;
  if (
    ![
      "owner",
      "title",
      "review_id",
      "category",
      "created_at",
      "votes",
      "designer",
      "comment_count",
      undefined,
    ].includes(sort_by)
  ) {
    return Promise.reject({ status: 400, msg: "Invalid sort query" });
  }

  if (!["ASC", "DESC", "asc", "desc", undefined].includes(order)) {
    return Promise.reject({ status: 400, msg: "Invalid order query" });
  }

  if (
    ![
      "euro game",
      "social deduction",
      "dexterity",
      "children's games",
      undefined,
    ].includes(category)
  ) {
    return Promise.reject({
      status: 400,
      msg: "Given category does not exist",
    });
  }

  let queryStr =
    "SELECT owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, designer, CAST(COUNT(comment_id) AS INT) AS comment_count FROM reviews\
    LEFT JOIN comments ON comments.review_id = reviews.review_id";
  const infoArray = [];
  let countStr = "SELECT CAST(COUNT(*) AS INT) AS total_count FROM reviews"

  if (category !== undefined) {
    queryStr += ` WHERE category = $1`;
    countStr += ` WHERE category = $1`;
    infoArray.push(category);
  }

  queryStr += " GROUP BY reviews.review_id";

  if (sort_by) {
    if (["review_id", "created_at", "votes"].includes(sort_by)) {
      sort_by = "reviews." + sort_by;
    }
    queryStr += ` ORDER BY ${sort_by} `;
    queryStr += order ? order.toUpperCase() : "DESC";
  } else {
    queryStr += " ORDER BY created_at ";
    queryStr += order ? order.toUpperCase() : "DESC";
  }
  queryStr += " LIMIT ";
  queryStr += limit ? `${limit}` : 10
  queryStr += p ? ` OFFSET ${p} ` : ''
  queryStr+= ';'

  const reviewCount = db.query(countStr, infoArray)
  
  const reviewsR =  db.query(queryStr, infoArray).then((reviews) => {
    return reviews.rows;
  });

  return Promise.all([reviewsR, reviewCount])
};

exports.fetchReviewsByID = (review_id) => {
  return db
    .query(
      `SELECT reviews.review_id, title, review_body, designer, review_img_url, reviews.votes, category, owner, reviews.created_at, CAST(COUNT(comment_id) AS INT) AS comment_count FROM reviews\
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
  return this.fetchReviewsByID(review_id)
    .then(() => {
      return db.query(
        `
        UPDATE reviews 
        SET votes = votes + $1
        WHERE review_id = $2
        RETURNING *;
        `,
        [inc_votes, review_id]
      );
    })
    .then((review) => {
      return review.rows[0];
    });
};

exports.fetchUsers = () => {
  return db
    .query(
      `
    SELECT * FROM users;
    `
    )
    .then((users) => {
      return users.rows;
    });
};

exports.removeComment = (comment_id) => {
  return db
    .query(
      `
    DELETE FROM comments WHERE comment_id = $1 
    RETURNING *;`,
      [comment_id]
    )
    .then((comment) => {
      if (comment.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "No comment with given id" });
      }
      return comment;
    });
};

exports.fetchUserByUsername = (username) => {
  return db
    .query(
      `
    SELECT * FROM users 
    WHERE username = $1;
  `,
      [username]
    )
    .then((user) => {
      if (user.rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "User with username given does not exist",
        });
      }
      return user.rows[0];
    });
};

exports.updateComment = (comment_id, body) => {
  const { inc_votes } = body;

  if (!inc_votes) {
    return Promise.reject({
      status: 400,
      msg: "Input data format was not correct",
    });
  }
  return db
    .query(
      `
  UPDATE comments 
  SET votes = votes + $1
  WHERE comment_id = $2
  RETURNING *;
  `,
      [inc_votes, comment_id]
    )
    .then((comment) => {
      if (comment.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "No comment with given id" });
      }
      return comment.rows[0];
    });
};

exports.addReview = (body) => {
  const { title, category, designer, owner, review_body } = body;

  if (!title || !category || !designer || !owner || !review_body) {
    return Promise.reject({
      status: 400,
      msg: "Input data format was not correct",
    });
  }
  const created_at = new Date();

  return db
    .query(
      `
    INSERT INTO reviews 
    (title, category, designer, owner, review_body, review_img_url, created_at, votes)
    VALUES
    ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `,[title, category, designer, owner, review_body, "url", created_at, 0]
    ).then((review) => {
      const {review_id} = review.rows[0]

      return db.query(`
        SELECT reviews.* , CAST(COUNT(comment_id) AS INT) AS comment_count FROM reviews
        LEFT JOIN comments ON comments.review_id = reviews.review_id
        WHERE reviews.review_id = $1
        GROUP BY reviews.review_id;
      `, [review_id])
    }).then((review)=>{
      return review.rows[0]
    });
};

