const Sequelize = require('sequelize');
console.log("uuidv1 = " + Sequelize.DataTypes.UUIDV1);
console.log("uuidv4 = " + Sequelize.DataTypes.UUIDV4());
let sequelize = new Sequelize('mysql://root:123@47.94.252.111:3306/testShuchong');
// sequelize
//     .authenticate()
//     .then(() => {
//         console.log('Connection has been established successfully.');
//     })
//     .catch(err => {
//         console.error('Unable to connect to the database:', err);
//     });

// let getJson = () => new Promise((resolve, reject) => {
//     setTimeout(() => resolve({a: "b"}), 1000);
// });
// //getJson().then(data => console.log(data));
//
// let makeRequest = async () => {
//     console.log(await getJson)
//     return "done";
// };
// let a = makeRequest();
// a.then(data => console.log(data));

requestParams = {
    appVersion: "2.1.0", //App版本号
    rnVersion: "2.1.0.1" //RN版本号，格式为App版本号.RN版本号
}

updateInfo = {
    inReview: false, //是否是审核中的状态
    app: {
        flag: 0, //0 无更新, 1 普通更新, 3 强制更新
        version: "2.2.0",
        url: "https://host/path/name.apk",
        size: 17854, //文件大小Byte，iOS为空
        md5: "md5string",
        msg: "更新文案"
    },
    rn: {
        flag: 0, //0 无更新, 1 普通更新, 3 强制更新
        version: "2.2.0.1",
        url: "https://host/path/name.patch",
        size: 17854, //文件大小Byte，iOS为空
        md5: "md5string",
        msg: "更新文案" //一般为空
    }
}

