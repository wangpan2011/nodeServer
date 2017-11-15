// const USER = require('./database/user/userDbHandler');
// var test = async () => {
//         var created = await USER.getOrCreateUser('lipan', '123456');
//         console.log(`结果是：${created}`)
//         if(created) {
//             console.log("创建用户成功：" + created);
//         } else {
//             console.log("创建用户失败1");
//         }
// };
// test().then((result)=>{
//     console.log(`success: ${result}`);
// }, (err)=>{
//     console.log(`err: ${err}`);
// });
const logger = require('./utils/logger');
logger.debug("debug");
logger.error("error");
logger.info("info");