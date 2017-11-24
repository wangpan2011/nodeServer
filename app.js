'use strict';

global.rootRequire = function(name) {
    return require(__dirname + '/' + name);
}

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const jwt = require('koa-jwt');
const app = new Koa();
const controller = require('./controller');
let staticFiles = require('./static-files');
let templating = require('./templating');
let rest = require('./rest');



app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url} ...`);
    await next();
});
app.use(staticFiles('/static/', __dirname + '/static'));
app.use(bodyParser());

app.use(rest.restify());

const isProduction = process.env.NODE_ENV === 'production';
app.use(templating('views', {
    noCache: !isProduction,
    watch: !isProduction
}));

app.use(jwt({ secret: 'shared-secret' }).unless({path: [/^\/api\/signin/]}));

app.use(controller());
app.listen(3000);
console.log('app started at port 3000...');