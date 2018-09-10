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

    let pitches = sequelize.define('pitch', {
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
        grassType: {
            type: Sequelize.DataTypes.TINYINT.UNSIGNED,
            defaultValue: 2
        },
        shieldType: {
            type: Sequelize.DataTypes.TINYINT.UNSIGNED,
            defaultValue: 1
        },
        grassClass: {
            type: Sequelize.DataTypes.TINYINT.UNSIGNED,
            defaultValue: 0
        },
        light: {
            type: Sequelize.DataTypes.TINYINT.UNSIGNED,
            defaultValue: 0
        },
    }, {
        timestamps: false
    });
    let stadiums = sequelize.define('stadium', {
        id: {
            type: Sequelize.DataTypes.INTEGER.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        name: Sequelize.DataTypes.STRING(255),
        locationText: Sequelize.DataTypes.STRING(255),
        locationCoordinateLatitude: Sequelize.DataTypes.FLOAT(7, 3),
        locationCoordinateLatitude: Sequelize.DataTypes.FLOAT(7, 3),
        locationProvince: Sequelize.DataTypes.STRING(255),
        locationCity: Sequelize.DataTypes.STRING(255),
        locationDistrict: Sequelize.DataTypes.STRING(255),
        trafficTips: Sequelize.DataTypes.STRING(255),
        introduction: Sequelize.DataTypes.STRING(2000),
        chargeTips: Sequelize.DataTypes.STRING(600),
        openTimeTips: Sequelize.DataTypes.STRING(100),
        contactName: Sequelize.DataTypes.STRING(30),
        contactPhoneNumber: Sequelize.DataTypes.STRING(13),
        adminId: {
            type: Sequelize.DataTypes.INTEGER.UNSIGNED,
            defaultValue: 1
        }
    }, {
        timestamps: false
    });
    let stadiumImages = sequelize.define('stadiumImage', {
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


    for(let city in cities) {

    }
    cities.forEach((city) => {
        let url = util.format(pitchListUrlTemplate, city);
        axios.get(url)
            .then(data => {
                let maxPage = getMaximumPagination(data);
                loadPageData(url, 1);
            })
            .catch(e => console.log(e));
    });

    function loadPageData(url, page) {
        return axios.get(url + "?page=" + page)
            .then(data => {
                let $ = cheerio.load(data.data);
                let pitchList = $(".mainbody>.listbody>.singlelist");

            });
    }

    function getMaximumPagination(data) {
        let $ = cheerio.load(data.data);
        let paginations = $(".pageplugin>.pagination>li");
        return $("a", paginations[paginations.length -2]).text();
    }
}

