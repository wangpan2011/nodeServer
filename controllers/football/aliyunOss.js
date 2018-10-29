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
            "callbackBody": "{\"filename\": ${object},\"size\": ${size},\"var1\": ${x:var1}}",
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
        console.log("ossCallback request = " + JSON.stringify(ctx.request.body));
        ctx.rest({
            ...ctx.request.body
        })
    }

};