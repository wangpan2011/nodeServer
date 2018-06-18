/**
 * Created by wangpan on 02/11/2017.
 */
let sequelize = require('./database_shuchong');
const Sequelize = require('sequelize');
module.exports = sequelize.define('favoriteArticle', {
    userId: Sequelize.STRING(100),
    articleId: Sequelize.BIGINT,
}, {
    timestamps: false
});