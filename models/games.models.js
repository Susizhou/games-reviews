const db = require("../db/connection.js");

exports.fetchCategories = ()=>{
    return db.query('SELECT * FROM categories').then((categories)=>{
        return categories.rows
    })
}