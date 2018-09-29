const Sequelize = require('sequelize');
let fs = require('fs');
let sequelize = new Sequelize('mysql://root:890116@localhost:3306/test');

let area = sequelize.define('sys_area', {
    ID: {
        type: Sequelize.DataTypes.INTEGER,
        primaryKey: true
    },
    AREA_CODE: Sequelize.STRING(50),
    AREA_NAME: Sequelize.STRING(100),
    PARENT_ID: Sequelize.DataTypes.INTEGER
}, {
    tableName: 'sys_area',
    timestamps: false
});

area.findAll()
    .then(data => console.log("总个数=" + data.length));

let result = [];
area.findAll({where: {PARENT_ID: 0}})
    .then(data => {
        console.log("省的个数：" + data.length);
        for(let i = 0; i < data.length; i ++) {
            let lastSheng = i === data.length - 1;
            let sheng = data[i];
            let shengAlt = {
                name: sheng.AREA_NAME,
                id: sheng.AREA_CODE,
            };
            area.findAll({where: {PARENT_ID: sheng.AREA_CODE}})
                .then(data => {
                    let shiArray = [];
                    for(let j = 0; j < data.length; j++) {
                        let lastShi = j === data.length - 1;
                        let shi = data[j];
                        let shiAlt = {
                            name: shi.AREA_NAME,
                            id: shi.AREA_CODE,
                        };
                        area.findAll({where: {PARENT_ID: shi.AREA_CODE}})
                            .then(data => {
                                let quArray = [];
                                for(let k = 0; k < data.length; k++) {
                                    let lastQu = k === data.length - 1;
                                    let qu = data[k];
                                    let quAlt = {
                                        name: qu.AREA_NAME,
                                        id: qu.AREA_CODE,
                                    };
                                    quArray.push(quAlt);
                                    if(lastSheng && lastShi && lastQu) {
                                        //console.log(JSON.stringify(result));
                                        console.log("###############################")
                                        fs.writeFile(__dirname + '/test.txt', JSON.stringify(result), {flag: 'a'}, function (err) {
                                            if(err) {
                                                console.error(err);
                                            } else {
                                                console.log('写入成功');
                                            }
                                        });
                                        console.log("生成的数据总个数" + countArea(result));
                                        console.log("完成");
                                        area.findAll()
                                            .then(data => console.log("原始数据总个数=" + data.length));
                                        let testData = [];
                                        console.log("测试数据个数: " + countArea(testData));
                                    }
                                }
                                shiAlt.children = quArray;
                                if(quArray.length == 0) {
                                    console.log("!!!!!!!!!!!! " + shiAlt.name + "有0个区");
                                }
                            });
                        shiArray.push(shiAlt);
                        shengAlt.children = shiArray;
                        if(shiArray.length == 0) {
                            console.log("!!!!!!!!!!!! " + shengAlt.name + "有0个市");
                        }
                    }
                })
            result.push(shengAlt);
        }
    });


function countArea(test) {

    let count = 0;
    for (let i = 0; i < test.length; i++) {
        //省
        count++;
        let children = test[i].children;
        if (children) {
            for (let j = 0; j < children.length; j++) {
                count++;
                let qu = children[j].children;
                if (qu && qu.length > 0) {
                    count += qu.length;
                } else {
                    console.log("!!!!!!!$$$$$$$$$$$$" + children[j].name);
                }

            }
        }
    }

    // console.log("个数 = " + count);
    return count;
}
