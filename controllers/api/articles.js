const articles = require('../../business/articles');

const APIError = require('../../rest').ApiError;

module.exports = {
    'GET /api/public/articles': async (ctx, next) => {
        ctx.rest({
            articles: await articles.getArticles(ctx.req.headers.token || 'abcd')
        });
    },

    'POST /api/products': async (ctx, next) => {
        var p = articles.createProduct(ctx.request.body.name, ctx.request.body.manufacturer, parseFloat(ctx.request.body.price));
        ctx.rest(p);
    },

    'DELETE /api/products/:id': async (ctx, next) => {
        console.log(`delete product ${ctx.params.id}...`);
        var p = articles.deleteProduct(ctx.params.id);
        if (p) {
            ctx.rest(p);
        } else {
            throw new APIError('product:not_found', 'product not found by id.');
        }
    }
};
