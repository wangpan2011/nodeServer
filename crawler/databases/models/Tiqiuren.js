const Sequelize = require('sequelize');
const DATABASE = require('../database');
module.exports = DATABASE.defineModel('tiqiurenResults', {
    tqrId: {
        type: Sequelize.DataTypes.STRING(10),
        allowNull: false,
        unique: true
    }
});