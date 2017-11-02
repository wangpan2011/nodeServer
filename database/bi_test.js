/**
 * Created by wangpan on 02/11/2017.
 */
let sequelize = require('./database_test');
const Sequelize = require('sequelize');
module.exports = sequelize.define('product', {
    id: {
        type: Sequelize.STRING(50),
        primaryKey: true
    },
    name: Sequelize.STRING(100),
    manufacture: Sequelize.STRING(100),
    price: Sequelize.STRING(30),
    createdAt: Sequelize.BIGINT,
    updatedAt: Sequelize.BIGINT,
    version: Sequelize.BIGINT
}, {
    timestamps: false
});