const Sequelize = require("sequelize");
const dbConnection = require('../database/database');

// Define model
const Category = dbConnection.define('categories', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

// Create table (use only one time)
Category.sync({ force: false });

module.exports = Category;