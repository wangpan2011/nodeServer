const Sequelize = require('sequelize');
const DATABASE = require('../database');
module.exports = DATABASE.defineModel('stadiumContacts', {
    stadiumId: {
        type: DATABASE.ID_TYPE,
        references: {
            model: 'stadiums',
            key: DATABASE.ID_NAME
        }
    },
    name: Sequelize.DataTypes.STRING(30),
    mobile: Sequelize.DataTypes.STRING(15),
    wechat: Sequelize.DataTypes.STRING(30),
    phone: Sequelize.DataTypes.STRING(15)
});