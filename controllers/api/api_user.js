const jwt = require('jsonwebtoken');
const APIError = require('../../rest').ApiError;
const USER = require('../../database/user/userDbHandler');
const logger = rootRequire('utils/logger');

module.exports = {
    'POST /api/public/signin': async (ctx, next) => {
        var
            username = ctx.request.body.username || '',
            password = ctx.request.body.password || '';
        if (username && password) {
            var user = await USER.getUser(username);
            if (user) {
                if (username === user.name && password === user.password) {
                    ctx.rest({
                        code: 'ok',
                        token: jwt.sign({username: username}, 'shared-secret'),
                        message: '登录成功'
                    });
                } else {
                    throw new APIError("user_password_err", "密码错误");
                }
            } else {
                throw new APIError("user_name_err", "用户名不存在");
            }
        } else {
            throw new APIError("user_name_err", "用户名密码不能为空");
        }
    },
    'POST /api/createUser': async (ctx, next) => {
        var
            username = ctx.request.body.username || '',
            password = ctx.request.body.password || '';
        logger.debug("user = %j", ctx.state.user);
        if (username && password) {
            var created = await USER.getOrCreateUser(username, password);
            logger.debug(`created = ${created}`);
            if(created) {
                ctx.rest({code: 'ok',
                message: '创建用户成功'});
            } else {
                throw new APIError('创建用户失败', '用户名已存在');
            }
        } else {
            console.log("创建用户失败2");
            throw new APIError('创建用户失败', '用户名和密码不能为空');
        }
    }
};
