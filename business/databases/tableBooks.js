/**
 * Created by wangpan on 02/11/2017.
 */
let sequelize = require('./database_shuchong');
const Sequelize = require('sequelize');
module.exports = sequelize.define('book', {
    id: {
        type: Sequelize.BIGINT,
        primaryKey: true
    },
    cover: Sequelize.TEXT,
    title: Sequelize.TEXT,
    intro: Sequelize.TEXT
}, {
    timestamps: false
});