/**
 * Created by wangpan on 08/11/2017.
 */
/**
 * Created by wangpan on 02/11/2017.
 */
const Sequelize = require('sequelize');

var sequelize = new Sequelize('warehouse', 'wangpan', 'wangpan', {
    host: '172.16.51.14',
    dialect: 'mysql',
    pool: {
        max: 5,
        min: 0,
        idle: 30000
    }
});
sequelize.query("select date_day as date,  pattern_code as type, per_or as overdue_rate from `bi_or_test`", { type: sequelize.QueryTypes.SELECT})
    .then(results => {
        console.log(results);
    });