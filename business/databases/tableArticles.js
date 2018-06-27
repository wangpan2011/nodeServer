/**
 * Created by wangpan on 02/11/2017.
 */
let sequelize = require('./database_shuchong');
const Sequelize = require('sequelize');
module.exports = sequelize.define('article', {
    id: {
        type: Sequelize.STRING(50),
        primaryKey: true
    },
    type: Sequelize.STRING(50),
    title: Sequelize.STRING(100),
    mediaType: Sequelize.STRING(30),
    mediaUrl: Sequelize.STRING(30),
    mediaTitle: Sequelize.STRING(30),
    introductionTitle: Sequelize.STRING(30),
    introduction: Sequelize.STRING(300),
    bookId: Sequelize.BIGINT,
    url: Sequelize.STRING(100),
    imageCenter: Sequelize.STRING(100),
    summary: Sequelize.TEXT,
}, {
    timestamps: false
});