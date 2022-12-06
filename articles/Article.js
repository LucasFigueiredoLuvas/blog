const Sequelize = require('sequelize');
const dbConnection = require('../database/database');
const Category = require('../categories/Category');

// Define model
const Article = dbConnection.define('articles', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

// Database's relations
Category.hasMany(Article);
Article.belongsTo(Category);

// Create table (use only one time)
Article.sync({ force: true });

module.exports = Article;