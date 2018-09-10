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

    let creditCard = sequelize.define('card', {
        id: {
            type: Sequelize.STRING(255),
            primaryKey: true
        },
        card_id_md5: Sequelize.STRING(255),
        card_des: Sequelize.STRING(255),
        card_name: Sequelize.STRING(255),
        card_image: Sequelize.STRING(255),
        card_image_big: Sequelize.STRING(255),
        apply_total: Sequelize.STRING(255),
        useName: Sequelize.STRING(255),
        levelName: Sequelize.STRING(255),
        bankName: Sequelize.STRING(255)
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
                loadPageData(url, page);
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

