const aliyunOss = require('ali-oss');
let OSS = require('ali-oss');
let client = new OSS({
    region: 'oss-cn-beijing',
    accessKeyId: '<Your AccessKeyId>',
    accessKeySecret: '<Your AccessKeySecret>'
});