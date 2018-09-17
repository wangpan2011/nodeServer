//导入所有的model
const fs = require('fs');

let files = fs.readdirSync(__dirname + '/models');

let jsFiles = files.filter(f => f.endsWith('.js'));

for (let f of jsFiles) {
    console.log(`import model from file ${f}...`);
    let name = f.substring(0, f.length - 3);
    module.exports[name] = require(__dirname + '/models/' + f);
}