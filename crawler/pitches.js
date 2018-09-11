/**
 * Created by wangpan on 09/09/2018.
 */

const Sequelize = require('sequelize');
let sequelize = new Sequelize('zhishang', 'root', '123', {
    host: '47.94.252.111',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 30000
    }
});

const cheerio = require('cheerio');
const axios = require('axios');
const util = require('util');
const cities = ["shanghai"];
const cityProvinceNames = {
    shanghai: "上海市",
    beijing: "北京市",
    shenzhen: "广东省"
};
const pitchListUrlTemplate = "http://www.tiqiuren.com/%s/stadium";
//test();
crawler();

function test() {
    sequelize.authenticate()
        .then(() => {
            console.log('Connection has been established successfully.');
        })
        .catch(err => {
            console.error('Unable to connect to the database:', err);
        });
}
function crawler() {

    let Pitch = sequelize.define('pitch', {
        id: {
            type: Sequelize.DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        stadiumId: Sequelize.DataTypes.INTEGER.UNSIGNED,
        parentId: {
            type: Sequelize.DataTypes.INTEGER.UNSIGNED,
            defaultValue: 0
        },
        type: {
            type: Sequelize.DataTypes.STRING(5),
            defaultValue: "未知"
        },
        grassType: {
            type: Sequelize.DataTypes.STRING(5),
            defaultValue: "未知"
        },
        shieldType: {
            type: Sequelize.DataTypes.STRING(5),
            defaultValue: "未知"
        },
        grassClass: {
            type: Sequelize.DataTypes.STRING(5),
            defaultValue: "未知"
        },
        light: {
            type: Sequelize.DataTypes.STRING(5),
            defaultValue: "未知"
        },
    }, {
        timestamps: false
    });
    let Stadium = sequelize.define('stadium', {
        id: {
            type: Sequelize.DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        name: Sequelize.DataTypes.STRING(255),
        locationText: Sequelize.DataTypes.STRING(255),
        locationProvince: Sequelize.DataTypes.STRING(255),
        locationCity: Sequelize.DataTypes.STRING(255),
        locationDistrict: Sequelize.DataTypes.STRING(255),
        trafficTips: Sequelize.DataTypes.STRING(255),
        introduction: Sequelize.DataTypes.STRING(2000),
        chargeTips: Sequelize.DataTypes.STRING(600),
        openTimeTips: Sequelize.DataTypes.STRING(100),
        recommendTips: Sequelize.DataTypes.STRING(255),
        tags: Sequelize.DataTypes.STRING(255),
        facilities: Sequelize.DataTypes.STRING(255),
        adminId: {
            type: Sequelize.DataTypes.INTEGER.UNSIGNED,
            defaultValue: 1
        }
    }, {
        timestamps: false
    });
    let StadiumContact = sequelize.define('stadiumContact', {
        id: {
            type: Sequelize.DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        stadiumId: Sequelize.DataTypes.INTEGER.UNSIGNED,
        name: Sequelize.DataTypes.STRING(30),
        mobile: Sequelize.DataTypes.STRING(15),
        wechat: Sequelize.DataTypes.STRING(30),
        phone: Sequelize.DataTypes.STRING(15)
    }, {
        timestamps: false
    });
    let StadiumImage = sequelize.define('stadiumImage', {
        id: {
            type: Sequelize.DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        path: Sequelize.DataTypes.STRING(255),
        stadiumId: Sequelize.DataTypes.INTEGER.UNSIGNED,
        isMainPhoto: Sequelize.DataTypes.BOOLEAN
    }, {
        timestamps: false
    });


    cities.forEach((city) => {
        let url = util.format(pitchListUrlTemplate, city);
        axios.get(url)
            .then(data => {
                let maxPage = getMaximumPagination(data);
                console.log("maxPage = " + maxPage);
                loadPageData(city, url, 1);
            })
            .catch(e => console.log(e));
    });

    function loadPageData(city, url, page) {
        return axios.get(url + "?page=" + page)
            .then(data => {
                let $ = cheerio.load(data.data);
                let pitchList = $(".mainbody>.listbody>.singlelist");
                console.log(url + "?page=" + page + ".    pitchList size = " + pitchList.length);
                for(let index = 0; index < pitchList.length; index ++) {
                    let pitch = pitchList[index];

                    let pitchDetailPath = $(".mod_img", pitch).attr("href");
                    let pitchDetailUrl = "http://www.tiqiuren.com" + pitchDetailPath;
                    axios.get(pitchDetailUrl)
                        .then(data => {
                            let $ = cheerio.load(data.data);
                            let stadium = new Stadium();
                            let stadiumContact = new StadiumContact();
                            let pitches = [];
                            stadium.name = $(".detailbox>.detail_tt>h1").text();
                            let detailInfo = $(".detailbox>.detail-info>.info>ol>li");
                            for(let i = 0; i < detailInfo.length; i++) {
                                let infoItem = detailInfo.eq(i);
                                let labelName = $("label", infoItem).text();
                                if(labelName.startsWith("地区")) {
                                    stadium.locationProvince = cityProvinceNames[city];
                                    stadium.locationCity = $("a", infoItem).eq(0).text();
                                    stadium.locationDistrict = $("a", infoItem).eq(1).text();
                                }
                            }

                            for(let i = 0; i < detailInfo.length; i++) {
                                let infoItem = detailInfo.eq(i);
                                let labelName = $("label", infoItem).text();
                                if (labelName.startsWith("场地类型")) {
                                    let allTypes = infoItem.contents().eq(1).text().split("|");
                                    for(let type in allTypes) {
                                        if(allTypes[type]) {
                                            let pitch = new Pitch();
                                            pitch.type = allTypes[type];
                                            pitches.push(pitch);
                                        }
                                    }
                                }
                            }
                            for(let i = 0; i < detailInfo.length; i++) {
                                let infoItem = detailInfo.eq(i);
                                let labelName = $("label", infoItem).text();
                                if (labelName.startsWith("球场灯光")) {
                                    for(let index in pitches) {
                                        pitches[index].light = infoItem.contents().eq(1).text();
                                    }
                                } else if (labelName.startsWith("草皮类型")) {
                                    for(let index in pitches) {
                                        pitches[index].grassType = infoItem.contents().eq(1).text();
                                    }

                                } else if (labelName.startsWith("草皮质量")) {
                                    for(let index in pitches) {
                                        pitches[index].grassClass = infoItem.contents().eq(1).text();
                                    }
                                }
                            }

                            let otherDetailList = $(".mainbody>.block-info>dl");
                            for(let i = 0; i < otherDetailList.length; i++) {
                                let detailItem = otherDetailList.eq(i);
                                let infoKey = $("dt", detailItem).text();
                                let infoValue = $("dd", detailItem).text();
                                if(infoKey && infoValue) {
                                    if(infoKey.startsWith("球场地址")) {
                                        stadium.locationText = infoValue;
                                    } else if (infoKey.startsWith("附近交通")) {
                                        stadium.trafficTips = infoValue;
                                    } else if (infoKey.startsWith("开放时间")) {
                                        stadium.openTimeTips = infoValue;
                                    } else if (infoKey.startsWith("收费信息")) {
                                        stadium.chargeTips = infoValue;
                                    } else if (infoKey.startsWith("球场介绍")) {
                                        stadium.introduction = infoValue;
                                    } else if (infoKey.startsWith("推荐理由")) {
                                        stadium.recommendTips = infoValue;
                                    } else if (infoKey.startsWith("标签")) {
                                        stadium.tags = infoValue;
                                    } else if (infoKey.startsWith("场馆设施")) {
                                        let facilityString = [];
                                        let facilities = $("dd>span", detailItem);
                                        for(let i = 0; i < facilities.length; i++) {
                                            let facility = facilities.eq(i);
                                            facilityString.push(facility.attr("title"));
                                        }
                                        stadium.facilities = facilityString.toString();
                                    }
                                }
                            }

                            //联系人
                            let contactInfoList = $(".mainbody>.contact>.contactinfo>ul>li");
                            for(let i = 0; i < contactInfoList.length; i++) {
                                let contactInfoItem = contactInfoList.eq(i);
                                let labelName = $("label", contactInfoItem).text();
                                if(labelName.startsWith("联系人")) {
                                    stadiumContact.name = contactInfoItem.contents().eq(1).text();
                                } else if(labelName.startsWith("电话")) {
                                    stadiumContact.phone = contactInfoItem.contents().eq(1).text();
                                } else if(labelName.startsWith("手机")) {
                                    stadiumContact.mobile = contactInfoItem.contents().eq(1).text();
                                } else if(labelName.startsWith("微信")) {
                                    stadiumContact.wechat = contactInfoItem.contents().eq(1).text();
                                }
                            }
                            console.log(stadium);
                            console.log(pitches);
                            console.log(stadiumContact);
                        });

                }
            })
            .catch(err => {
                console.log(err)
            });
    }

    function getMaximumPagination(data) {
        let $ = cheerio.load(data.data);
        let paginations = $(".pageplugin>.pagination>li");
        return $("a", paginations[paginations.length -2]).text();
    }
}

