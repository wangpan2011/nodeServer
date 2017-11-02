// store products as database:
let DbProduct = require('./database/product_test');

module.exports = {
    getProducts: () => {
        var products = DbProduct.findAll();
        return products;
    },

    getProduct: (id) => {
            var product = DbProduct.findAll({
                where: {
                    id: id
                }
            });
            return product;
    },

    createProduct: (name, manufacturer, price) => {
        var now = Date.now();
        var product = DbProduct.create({
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
        var product = DbProduct.findAll({
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
