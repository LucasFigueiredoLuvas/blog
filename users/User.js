const Sequelize = require("sequelize");
const dbConnection = require('../database/database');

// Define model
const User = dbConnection.define('users', {
    email: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

// Create table
User.sync({ force: false });

module.exports = User;