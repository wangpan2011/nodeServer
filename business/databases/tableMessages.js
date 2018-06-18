/**
 * Created by wangpan on 02/11/2017.
 */
let sequelize = require('./database_shuchong');
const Sequelize = require('sequelize');
module.exports = sequelize.define('message', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    content: Sequelize.TEXT,
    userId: Sequelize.STRING(300),
    bookId: Sequelize.INTEGER,
    upCount: Sequelize.INTEGER
}, {
    timestamps: false
});