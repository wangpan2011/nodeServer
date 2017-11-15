/**
 * Created by wangpan on 16/11/2017.
 */
const winston = require('winston');
var logger = new (winston.Logger)({
    level: 'debug',
    transports: [
        new (winston.transports.Console)({colorize:true}),
        //new (winston.transports.File)({ filename: 'logfile.log' })
    ]
});
module.exports = logger;