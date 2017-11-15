/**
 * Created by wangpan on 02/11/2017.
 */
const Constants = require('./constants');

module.exports = {
    ApiError: function (code, message) {
        this.code = code || 'internal:unknown_error';
        this.message = message || '';
    },
    restify: (pathPrefix) => {
        // REST API前缀，默认为/api/:
        pathPrefix = pathPrefix || '/api/';
        return async (ctx, next) => {
            // 是否是REST API前缀?
            if (ctx.request.path.startsWith(pathPrefix)) {
                // 绑定rest()方法:
                ctx.rest = (data) => {
                    ctx.response.type = 'application/json';
                    ctx.response.body = data;
                }
                try {
                    await next();
                } catch (e) {
                    ctx.response.status = Constants.API_ERR_HTTP_CODE;
                    ctx.response.type = 'application/json';
                    ctx.response.body = {
                        code: e.code || 'unknown_error',
                        message: e.message || '位置错误'
                    };
                }
            } else {
                await next();
            }
        };
    }
};