/**
 * Created by wangpan on 02/11/2017.
 */
let sequelize = require('./database_shuchong');
const Sequelize = require('sequelize');
module.exports = sequelize.define('user', {
    id: {
        type: Sequelize.STRING(100),
        primaryKey: true
    },
    avatar: Sequelize.STRING(100),
    weixinName: Sequelize.STRING(300),
}, {
    timestamps: false
});