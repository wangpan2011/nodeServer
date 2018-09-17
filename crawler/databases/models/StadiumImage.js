const Sequelize = require('sequelize');
const DATABASE = require('../database');
module.exports = DATABASE.defineModel('stadiumImages', {
    stadiumId: {
        type: DATABASE.ID_TYPE,
        references: {
            model: 'stadiums',
            key: DATABASE.ID_NAME
        }
    },
    path: Sequelize.DataTypes.STRING(255),
    isMainPhoto: {
        type: Sequelize.DataTypes.BOOLEAN,
        defaultValue: false
    }
});