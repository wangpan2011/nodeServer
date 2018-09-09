/**
 * Created by wangpan on 09/09/2018.
 */
const cheerio = require('cheerio');
const axios = require('axios');
const util = require('util');
const cities = ["shanghai"];
const pitchListUrlTemplate = "http://www.tiqiuren.com/%s/stadium";
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
        .then();
}

function getMaximumPagination(data) {
    let $ = cheerio.load(data.data);
    let paginations = $(".pageplugin>.pagination>li");
    return $("a", paginations[paginations.length -2]).text();
}
