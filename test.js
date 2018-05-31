const Sequelize = require('sequelize');
let sequelize = new Sequelize('mysql://root:123@47.94.252.111:3306/testShuchong');
sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });