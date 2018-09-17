const Sequelize = require('sequelize');
const DATABASE = require('../database');
module.exports = DATABASE.defineModel('stadiums', {
    name: Sequelize.DataTypes.STRING(255),
    locationText: Sequelize.DataTypes.STRING(255),
    locationProvince: Sequelize.DataTypes.STRING(255),
    locationCity: Sequelize.DataTypes.STRING(255),
    locationDistrict: Sequelize.DataTypes.STRING(255),
    trafficTips: Sequelize.DataTypes.STRING(255),
    introduction: Sequelize.DataTypes.STRING(2000),
    chargeTips: Sequelize.DataTypes.STRING(600),
    openTimeTips: Sequelize.DataTypes.STRING(100),
    recommendTips: Sequelize.DataTypes.STRING(255),
    tags: Sequelize.DataTypes.STRING(255),
    facilities: Sequelize.DataTypes.STRING(255),
    adminId: {
        type: DATABASE.ID_TYPE,
        defaultValue: 1
    }
});