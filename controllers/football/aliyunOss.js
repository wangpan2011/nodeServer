const crypto = require("crypto")

const jwt = require('jsonwebtoken');
const APIError = require('../../rest').ApiError;
const USER = require('../../database/user/userDbHandler');
const user = require('../../business/databases/tableUsers');
const message = require('../../business/databases/tableMessages');
const logger = rootRequire('utils/logger');
const axios = require('axios');

const config = {
    dirPath: 'oss/file/', //oss 文件夹 不存在会自动创建
    bucket: 'zhishangl-test', //oss应用名
    region: 'oss-cn-beijing', //oss节点名
    accessKeyId: 'LTAIrwQ5wxrCDyw7', //申请的osskey
    accessKeySecret: 'cwso6ZnSJrxYxe862Iau9oN5ke9VcW', //申请的osssecret
    callbackHost: "www.ooooooo.online", //回调host,一定要能被外网访问的地址
    callbackPort: "3000", //回调端口
    callbackPath: "api/public/ossCallback", //回调接口
    expAfter: 60000, //签名失效时间
    maxSize: 1048576000 //最大文件大小
}


module.exports = {
    'GET /api/public/ossSignature': async (ctx, next) => {
        const {
            bucket,
            region,
            expAfter,
            maxSize,
            dirPath,
            accessKeyId,
            accessKeySecret,
            callbackHost,
            callbackPort,
            callbackPath
        } = config;
        const host = `http://${bucket}.${region}.aliyuncs.com`; //你的oss完整地址
        const expireTime = new Date().getTime() + expAfter;
        const expiration = new Date(expireTime).toISOString();
        const policyString = JSON.stringify({
            expiration,
            conditions: [
                ['content-length-range', 0, maxSize],
                ['starts-with', '$key', dirPath]
            ]
        });
        const policy = Buffer(policyString).toString("base64");
        const Signature = crypto.createHmac('sha1', accessKeySecret).update(policy).digest("base64")
        const callbackBody = {
            "callbackUrl": `http://${callbackHost}:${callbackPort}/${callbackPath}`,
            "callbackHost": `${callbackHost}`,
            "callbackBody": "{\"filename\": ${object},\"size\": ${size}}",
            "callbackBodyType": "application/json"
        };
        const callback = Buffer(JSON.stringify(callbackBody)).toString('base64');
        ctx.rest({
            'signature': Signature,
            policy,
            host,
            'accessId': accessKeyId,
            'expireTime': expireTime,
            'success_action_status': 200,
            dirPath,
            callback
        });
    },
    'POST /api/public/ossCallback': async (ctx, next) => {
        logger.debug("ossCallback request = %j", ctx.request);
        ctx.rest({
            ...ctx.request.body
        })
    },
    'POST /api/public/login': async (ctx, next) => {
        let weixinCode = ctx.request.body.weixinCode || '';
        if (weixinCode) {
            let userinfo = await axios.get('https://api.weixin.qq.com/sns/oauth2/access_token', {
                params: {
                    appid: 'wx18815da5a5a8cd71',
                    secret: '26794b26f43c96ae31724601dd29670f',
                    code: weixinCode,
                    grant_type: 'authorization_code'
                }
            }).then((data) => {
                if (!data.data.access_token) {
                    throw new APIError(data.data.errcode, data.data.errmsg);
                } else {
                    console.log("微信accessToken: " + data.data.access_token);
                    return axios.get('https://api.weixin.qq.com/sns/userinfo?access_token=' + data.data.access_token + '&openid=' + data.data.openid);
                }
            }).then((data) => {
                if (!data.data.openid) {
                    throw new APIError(data.data.errcode, data.data.errmsg);
                } else {
                    let userInfo = {
                        id: data.data.openid,
                        avatar: data.data.headimgurl,
                        weixinName: data.data.nickname,
                    };
                    return new Promise(function (resolve, reject) {
                        user.upsert(userInfo).then(
                            (created) => {
                                console.log("用户登录：" + userInfo.id + "/" + userInfo.weixinName + ", 第一次登录？" + created);
                                resolve(userInfo);
                            }
                        ).catch(
                            err => reject(err)
                        );
                    });
                    //return Promise.all([user.upsert(userInfo), Promise.resolve(userInfo)]);
                }
            }).then(
                (data) => {
                    console.log(data);
                    return data;
                }
            ).catch((err) => {
                throw new APIError("weixin_server_err", "微信服务出错：" + err.code + "/" + err.message);
            });
            ctx.rest(userinfo);
        } else {
            throw new APIError("user_name_err", "微信code不能为空");
        }
    },

    'POST /api/message/write': async (ctx, next) => {
        let openid = ctx.request.headers.openid || '';
        let bookid = ctx.request.body.bookid || '';
        let content = ctx.request.body.content || '';
        if (!openid) {
            throw new APIError("not_login", "请先登录");
        }
        if (!bookid) {
            throw new APIError("params_required", "参数不能为空：bookid");
        }
        if (!content) {
            throw new APIError("params_required", "参数不能为空：content");
        }

        let writeMsgResult = await message.create({
            content: content,
            userId: openid,
            bookId: bookid
        });
        if (writeMsgResult) {
            ctx.rest(writeMsgResult);
        } else {
            throw new APIError("error", "写留言失败");
        }
    },

    'POST /api/message/up': async (ctx, next) => {
        let openid = ctx.request.headers.openid || '';
        let messageId = ctx.request.body.messageId || '';
        if (!openid) {
            throw new APIError("not_login", "请先登录");
        }
        if (!messageId) {
            throw new APIError("params_required", "参数不能为空：messageId");
        }

        let newUpCount = await message.increment('upCount', {
            where: {id: messageId}
        }).then(
            () => message.findById(messageId)
        ).then(
            data => {
                return data.upCount;
            }
        ).catch();
        if (newUpCount) {
            ctx.rest(newUpCount);
        } else {
            throw new APIError("error", "点赞留言失败");
        }
    },

    'POST /api/public/message': async (ctx, next) => {
        let bookId = ctx.request.body.bookId || '';
        if (!bookId) {
            throw new APIError("params_required", "参数不能为空：bookId");
        }
        user.hasMany(message, {foreignKey: 'userId'});
        message.belongsTo(user, {foreignKey: 'userId'});
        let allMsgs = await message.findAll({
            where: {bookId: bookId},
            include: [user]
        });
        if (allMsgs) {
            // allMsgs.forEach(cur => {
            //     delete cur.userId;
            //     delete cur.user.id;
            // })
            ctx.rest(allMsgs);
        } else {
            throw new APIError("error", "查询留言失败");
        }
    },

    'POST /api/message/up': async (ctx, next) => {
        let openid = ctx.request.headers.openid || '';
        let messageId = ctx.request.body.messageId || '';
        if (!openid) {
            throw new APIError("not_login", "请先登录");
        }
        if (!messageId) {
            throw new APIError("params_required", "参数不能为空：messageId");
        }

        let newUpCount = await message.increment('upCount', {
            where: {id: messageId}
        }).then(
            () => message.findById(messageId)
        ).then(
            data => {
                return data.upCount;
            }
        ).catch();
        if (newUpCount) {
            ctx.rest(newUpCount);
        } else {
            throw new APIError("error", "点赞留言失败");
        }
    },


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
            if (created) {
                ctx.rest({
                    code: 'ok',
                    message: '创建用户成功'
                });
            } else {
                throw new APIError('创建用户失败', '用户名已存在');
            }
        } else {
            console.log("创建用户失败2");
            throw new APIError('创建用户失败', '用户名和密码不能为空');
        }
    }
};