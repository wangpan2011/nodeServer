// store products as database:
let tableArticles = require('./databases/tableArticles');
const sequelize = require('./databases/database_shuchong');
const Sequelize = require('sequelize');

module.exports = {
    getArticles: () => {
        // var articles = tableArticles.findAll();
        // return articles;
        return sequelize.query('SELECT * FROM articles', {
            logging: console.log,
            plain: false,
            raw: false,
            type: Sequelize.QueryTypes.SELECT
        });
        },

    getProduct: (id) => {
            var product = tableArticles.findAll({
                where: {
                    id: id
                }
            });
            return product;
    },

    createProduct: (name, manufacturer, price) => {
        var now = Date.now();
        var product = tableArticles.create({
            id: 'g-' + now,
            name: name,
            manufacture: manufacturer,
            price: price,
            createdAt: now,
            updatedAt: now,
            version: 0
        });
        return product;
    },

    deleteProduct: (id) => {
        var product = tableArticles.findAll({
            where: {
                id: id
            }
        });
        if (product) {
            product.destroy();
        }
        return product;
    }
};
