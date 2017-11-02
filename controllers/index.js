// index:

module.exports = {
    'GET /': async (ctx, next) => {
        ctx.render('index.html', {
            title: 'Welcome'
        });
    },
    'GET /products': async (ctx, next) => {
        ctx.render('products.html', {
            title: 'Welcome'
        });
    },
};
