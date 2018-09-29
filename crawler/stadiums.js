/**
 * Created by wangpan on 09/09/2018.
 */
const Models = require('./databases/models.js');
const DatabaseUtils = require('./databases/utils');
const cheerio = require('cheerio');
const axios = require('axios');
const util = require('util');
const cities = ["shanghai"];
const cityProvinceNames = {
    shanghai: "上海市",
    beijing: "北京市",
    shenzhen: "广东省"
};
const AllStadiumsUrlTemplate = "http://www.tiqiuren.com/%s/stadium";
// test();
crawler();

function test() {
    DatabaseUtils.createTable();
    // sequelize.authenticate()
    //     .then(() => {
    //         console.log('Connection has been established successfully.');
    //
    //     })
    //     .catch(err => {
    //         console.error('Unable to connect to the database:', err);
    //     });
}

function crawler() {

    let Pitch = Models.Pitch;
    let Stadium = Models.Stadium;
    let StadiumContact = Models.StadiumContact;
    let StadiumImage = Models.StadiumImage;
    let Tiqiuren = Models.Tiqiuren;


    cities.forEach((city) => {
        let url = util.format(AllStadiumsUrlTemplate, city);
        axios.get(url)
            .then(data => {
                let maxPage = getMaximumPagination(data);
                console.log("maxPage = " + maxPage);
                loadPageData(city, url, 1);
            })
            .catch(e => console.log("获取城市信息失败(" + city + "): " + e));
    });

    function loadPageData(city, url, page) {
        return axios.get(url + "?page=" + page)
            .then(data => {
                let $ = cheerio.load(data.data);
                let stadiumList = $(".mainbody>.listbody>.singlelist");
                console.log(url + "?page=" + page + ".    pitchList size = " + stadiumList.length);
                for (let index = 0; index < stadiumList.length; index++) {
                    let pitch = stadiumList[index];

                    let stadiumDetailPath = $(".mod_img", pitch).attr("href");
                    let stadiumDetailUrl = "http://www.tiqiuren.com" + stadiumDetailPath;
                    getStadiumDetail(city, stadiumDetailUrl);
                }
            })
            .catch(err => {
                console.log("获取" + city + "第" + page + "页信息失败： " + err)
            });
    }

    function getStadiumDetail(city, stadiumDetailUrl) {
        axios.get(stadiumDetailUrl)
            .then(data => {
                let $ = cheerio.load(data.data);
                let stadium = {};
                let stadiumContact = {};
                let pitches = [];
                stadium.name = $(".detailbox>.detail_tt>h1").text();
                let detailInfo = $(".detailbox>.detail-info>.info>ol>li");
                for (let i = 0; i < detailInfo.length; i++) {
                    let infoItem = detailInfo.eq(i);
                    let labelName = $("label", infoItem).text();
                    if (labelName.startsWith("地区")) {
                        stadium.locationProvince = cityProvinceNames[city];
                        stadium.locationCity = $("a", infoItem).eq(0).text();
                        stadium.locationDistrict = $("a", infoItem).eq(1).text();
                    }
                }

                for (let i = 0; i < detailInfo.length; i++) {
                    let infoItem = detailInfo.eq(i);
                    let labelName = $("label", infoItem).text();
                    if (labelName.startsWith("场地类型")) {
                        let allTypes = infoItem.contents().eq(1).text().split("|");
                        for (let type in allTypes) {
                            if (allTypes[type]) {
                                let pitch = {};
                                pitch.type = allTypes[type];
                                pitches.push(pitch);
                            }
                        }
                    }
                }
                for (let i = 0; i < detailInfo.length; i++) {
                    let infoItem = detailInfo.eq(i);
                    let labelName = $("label", infoItem).text();
                    if (labelName.startsWith("球场灯光")) {
                        for (let index in pitches) {
                            pitches[index].light = infoItem.contents().eq(1).text();
                        }
                    } else if (labelName.startsWith("草皮类型")) {
                        for (let index in pitches) {
                            pitches[index].grassType = infoItem.contents().eq(1).text();
                        }

                    } else if (labelName.startsWith("草皮质量")) {
                        for (let index in pitches) {
                            pitches[index].grassClass = infoItem.contents().eq(1).text();
                        }
                    }
                }

                let otherDetailList = $(".mainbody>.block-info>dl");
                for (let i = 0; i < otherDetailList.length; i++) {
                    let detailItem = otherDetailList.eq(i);
                    let infoKey = $("dt", detailItem).text();
                    let infoValue = $("dd", detailItem).text();
                    if (infoKey && infoValue) {
                        if (infoKey.startsWith("球场地址")) {
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
                            for (let i = 0; i < facilities.length; i++) {
                                let facility = facilities.eq(i);
                                facilityString.push(facility.attr("title"));
                            }
                            stadium.facilities = facilityString.toString();
                        }
                    }
                }

                //联系人
                let contactInfoList = $(".mainbody>.contact>.contactinfo>ul>li");
                for (let i = 0; i < contactInfoList.length; i++) {
                    let contactInfoItem = contactInfoList.eq(i);
                    let labelName = $("label", contactInfoItem).text();
                    if (labelName.startsWith("联系人")) {
                        stadiumContact.name = contactInfoItem.contents().eq(1).text();
                    } else if (labelName.startsWith("电话")) {
                        stadiumContact.phone = contactInfoItem.contents().eq(1).text();
                    } else if (labelName.startsWith("手机")) {
                        stadiumContact.mobile = contactInfoItem.contents().eq(1).text();
                    } else if (labelName.startsWith("微信")) {
                        stadiumContact.wechat = contactInfoItem.contents().eq(1).text();
                    }
                }
                console.log(stadium);
                console.log(pitches);
                console.log(stadiumContact);
            })
            .catch(err => console.log("获取" + stadiumDetailUrl + "信息失败: " + err));
    }

    function getMaximumPagination(data) {
        let $ = cheerio.load(data.data);
        let paginations = $(".pageplugin>.pagination>li");
        return $("a", paginations[paginations.length - 2]).text();
    }
}

