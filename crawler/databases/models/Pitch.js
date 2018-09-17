const Sequelize = require('sequelize');
const DATABASE = require('../database');
module.exports = DATABASE.defineModel('pitches', {
    stadiumId: {
        type: DATABASE.ID_TYPE,
        references: {
            model: 'stadiums',
            key: DATABASE.ID_NAME
        }
    },
    parentId: {
        type: DATABASE.ID_TYPE,
        defaultValue: 0
    },
    type: {
        type: Sequelize.DataTypes.STRING(5),
        defaultValue: "未知"
    },
    grassType: {
        type: Sequelize.DataTypes.STRING(5),
        defaultValue: "未知"
    },
    shieldType: {
        type: Sequelize.DataTypes.STRING(5),
        defaultValue: "未知"
    },
    grassClass: {
        type: Sequelize.DataTypes.STRING(5),
        defaultValue: "未知"
    },
    light: {
        type: Sequelize.DataTypes.STRING(5),
        defaultValue: "未知"
    },
});