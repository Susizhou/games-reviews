const db = require("../db/connection.js");
const reviews = require("../db/data/test-data/reviews.js");

exports.fetchCategories = ()=>{
    return db.query('SELECT * FROM categories').then((categories)=>{
        return categories.rows
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