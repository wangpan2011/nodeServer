/**
 * Created by wangpan on 02/11/2017.
 */
let sequelize = require('../database_bless');
const Sequelize = require('sequelize');
module.exports = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.STRING(100),
    password: Sequelize.STRING(30),
    phoneNumber:Sequelize.STRING(30),
    createdAt: Sequelize.BIGINT,
    updatedAt: Sequelize.BIGINT,
}, {
    timestamps: false
});