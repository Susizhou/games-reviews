const db = require("../db/connection.js");

exports.fetchCategories = ()=>{
    return db.query('SELECT * FROM categories').then((categories)=>{
        return categories.rows
    })
}

exports.fetchReviews = () =>{
    return db.query('SELECT owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, designer, COUNT(comment_id) AS comment_count FROM reviews\
    LEFT JOIN comments ON comments.review_id = reviews.review_id\
    GROUP BY reviews.review_id\
    ORDER BY reviews.created_at ASC;').then((reviews) =>{
        return reviews.rows
    })
}