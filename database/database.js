// ORM
const Sequelize = require("sequelize");

// MySQL config. connection - change 'userName' and 'userPassword' bellow
const connection = new Sequelize('node_blog_db', 'userName', 'userPassword', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
});

module.exports = connection;