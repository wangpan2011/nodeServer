const articles = require('../../business/articles');

const APIError = require('../../rest').ApiError;
const tableFavoriteArticles = require('../../business/databases/tableFavoriteArticle');

module.exports = {
    'GET /api/public/articles': async (ctx, next) => {
         let allArticles = await articles.getArticles(ctx.request.headers.openid);
        ctx.rest({
            pageSize: 20,
            totalPage: 1,
            curPage: 0,
            pageData: allArticles
        });
    },
    'GET /api/public/articles/:id': async (ctx, next) => {
        ctx.rest(await articles.articleDetail(ctx.params.id));
    },

    'POST /api/articles/favorite': async (ctx, next) => {
        let openid = ctx.request.headers.openid || '';
        let articleId = ctx.request.body.articleId || '';
        if (!openid) {
            throw new APIError("not_login", "请先登录");
        }
        if (!articleId) {
            throw new APIError("params_required", "参数不能为空：articleId");
        }
        let favoriteResult = await tableFavoriteArticles.create({
            userId: openid,
            articleId: articleId
        });
        if(favoriteResult) {
            ctx.rest();
        } else {
            throw new APIError("error", "收藏文章失败");
        }
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
