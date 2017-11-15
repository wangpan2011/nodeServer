// store products as database:
const user = require('./userModule');
const logger = rootRequire('utils/logger');

module.exports = {
    getUser: (name) => {
            var product = user.findOne({
                where: {name: name},
                attribute:['id', ['name', 'password', 'phoneNumber']]
            });
            return product;
    },

    getOrCreateUser: (name, password) => {
        return user.findOrCreate({
            where: {name: name},
            defaults: {password: password,
                createdAt: Date.now()
            }
        }).spread((user, created) => {
            logger.debug("%j, created=%s", user, created);
            return created;
        });
    },

    createUser: (username, password) => {
        var createdUser = user.create({
            name: username,
            password: password,
            createdAt: Date.now()
        });
        return createdUser;
    },

    deleteUser: (name) => {
        var usersWithName = user.findAll({
            where: {
                name: name
            }
        });
        if (usersWithName) {
            usersWithName.destroy();
        }
        return usersWithName;
    }
};
