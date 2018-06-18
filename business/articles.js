// store products as database:
let tableArticles = require('./databases/tableArticles');
let tableBooks = require('./databases/tableBooks');
let tableMessages = require('./databases/tableMessages');
const tableUsers = require('./databases/tableUsers');
const sequelize = require('./databases/database_shuchong');
const Sequelize = require('sequelize');
const Promise = require('bluebird');

module.exports = {
    getArticles: (openid) => {
        let tasks = [];
        let articlesPromise = sequelize.query('SELECT id, type, title, url, imageCenter, summary FROM articles', {
            logging: console.log,
            plain: false,
            raw: false,
            type: Sequelize.QueryTypes.SELECT
        });
        tasks.push(articlesPromise);
        if (openid) {
            let favoritesPromise = sequelize.query('SELECT articleId FROM favoriteArticles where userId = :userId', {
                logging: console.log,
                plain: false,
                raw: true,
                type: Sequelize.QueryTypes.SELECT,
                replacements: {userId: openid}
            });
            tasks.push(favoritesPromise);
        }
        return Promise.all(tasks).then((results) => {
            let articles = results[0];
            let favoriteIds;
            if (openid) {
                let favorites = results[1];
                favoriteIds = favorites.map(favorite => favorite.articleId);
            }
            articles.forEach((article) => {
                let type = article.type;
                switch (type) {
                    case 1:
                        article.typeTitle = "关于书虫";
                        break;
                    case 2:
                        article.typeTitle = "每日一篇";
                        break;
                    case 3:
                        article.typeTitle = "每日一篇";
                        break;
                    case 4:
                        article.typeTitle = "为您推荐";
                        break;
                    default:
                        article.typeTitle = "书虫推荐";
                        break;
                }
                article.favorite = false;
                if (openid && favoriteIds && favoriteIds.indexOf(article.id) != -1) {
                    article.favorite = true;
                }
            });
            return articles;
        });
    },

    articleDetail: (articleId) => {
        return tableArticles.findById(articleId).then(
            (article) => {
                return new Promise(function (resolve, reject) {
                    tableUsers.hasMany(tableMessages, {foreignKey: 'userId'});
                    tableMessages.belongsTo(tableUsers, {foreignKey: 'userId'});
                    let messagesPromise = tableMessages.findAll({
                        where: {bookId: article.bookId},
                        include: [tableUsers]
                    });
                    Promise.all([tableBooks.findById(article.bookId), messagesPromise])
                        .then((results) => {
                            article = article.dataValues;
                            article.book = results[0].dataValues;
                            article.comments = results[1].map( comment => comment.dataValues);
                            article.comments.forEach( comment => {
                                delete comment.userId;
                                delete comment.bookId;
                            });
                            delete article.bookId;
                            resolve(article);
                        })
                        .catch(err => reject(err));
                });
            }
        );
    },
















    getProduct: (id) => {
        var product = tableArticles.findAll({
            where: {
                id: id
            }
        });
        return product;
    },

    createProduct: (name, manufacturer, price) => {
        var now = Date.now();
        var product = tableArticles.create({
            id: 'g-' + now,
            name: name,
            manufacture: manufacturer,
            price: price,
            createdAt: now,
            updatedAt: now,
            version: 0
        });
        return product;
    },

    deleteProduct: (id) => {
        var product = tableArticles.findAll({
            where: {
                id: id
            }
        });
        if (product) {
            product.destroy();
        }
        return product;
    }
};
