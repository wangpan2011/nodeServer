const APIError = require('../rest').APIError;
const USER = require('../database/user/userModule');

module.exports = {
    'POST /api/signin': async (ctx, next) => {
        var
            username = ctx.request.body.username || '',
            password = ctx.request.body.password || '';
        if (username === 'admin@example.com' && password === '123456') {
            console.log('signin ok!');
            ctx.render('signin-ok.html', {
                title: 'Sign In OK',
                name: 'Mr Node'
            });
        } else {
            console.log('signin failed!');
            ctx.render('signin-failed.html', {
                title: 'Sign In Failed'
            });
        }
    },
    'POST /api/createAccount': async (ctx, next) => {
        var
            username = ctx.request.body.username || '',
            password = ctx.request.body.password || '';
        console.log(`username = ${username}, password = ${password}`);
        if (username && password) {
            var now = Date.now();
            var user = USER.create({
                name: username,
                password: password,
                createdAt: now,
                updatedAt: now
            });
            if(user) {
                console.log("创建用户成功：" + user);
                ctx.rest({code: 'ok',
                message:'创建用户成功'});
            } else {
                console.log("创建用户失败1");
                throw new APIError('product:not_found', 'product not found by id.');
            }
        } else {
            console.log("创建用户失败2");
            throw new APIError('product:not_found', 'product not found by id.');
        }
    }
};
