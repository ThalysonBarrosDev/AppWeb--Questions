const Sequelize = require('sequelize');

const connection = new Sequelize('db_guiaperguntas', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;