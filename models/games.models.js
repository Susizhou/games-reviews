const db = require("../db/connection.js");
const reviews = require("../db/data/test-data/reviews.js");

exports.fetchCategories = ()=>{
    return db.query('SELECT * FROM categories').then((categories)=>{
        return categories.rows
    })
}

exports.fetchReviews = () =>{
    return db.query('SELECT owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, designer, COUNT(comment_id) AS comment_count FROM reviews\
    LEFT JOIN comments ON comments.review_id = reviews.review_id\
    GROUP BY reviews.review_id\
    ORDER BY reviews.created_at DESC;').then((reviews) =>{
        return reviews.rows
    })
}

exports.fetchReviewsByID = (review_id) =>{
    return db.query('SELECT review_id, title, review_body, designer, review_img_url, votes, category, owner, created_at FROM reviews\
    WHERE review_id = $1', [review_id]).then((review) =>{
        if (review.rows.length === 0) {
            return Promise.reject({status: 404, msg: 'ID does not exist'});
        }
        return review.rows[0]
    })
}
