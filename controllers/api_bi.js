let sequelize = require('../database/database_bi');
const APIError = require('../rest').APIError;

module.exports = {
    'GET /api/overduerate': async (ctx, next) => {
        ctx.rest(await sequelize.query("select date_day as date,  pattern_code as type, per_or as overdue_rate from `bi_or_test`", { type: sequelize.QueryTypes.SELECT}));
    },
};
