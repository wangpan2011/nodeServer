const APIError = require('../../rest').ApiError;
const tableBooks = require('../../business/databases/tableBooks');
const tableArticles = require('../../business/databases/tableArticles');

module.exports = {
    'POST /api/public/guanli/book': async (ctx, next) => {
        let password = ctx.request.body.password || '';
        let book_name = ctx.request.body.book_name || '';
        let book_cover = ctx.request.body.book_cover || '';
        let book_intro = ctx.request.body.book_intro || '';
        if (!password || password !== 'yaodengke') {
            throw new APIError("not_login", "密码为空或密码错误");
        }
        if (!book_cover) {
            throw new APIError("params_required", "书名不能为空");
        }
        if (!book_intro) {
            throw new APIError("params_required", "封面不能为空");
        }

        let result = await tableBooks.create({
            cover: book_cover,
            title: book_name,
            intro: book_intro
        });
        if(result) {
            ctx.rest("保存成功");
        } else {
            throw new APIError("error", "保存失败");
        }
    },
    'POST /api/public/guanli/article': async (ctx, next) => {
        let password = ctx.request.body.password || '';
        let type = ctx.request.body.type || '';
        let title = ctx.request.body.title || '';
        let mediaType = ctx.request.body.mediaType || '';
        let mediaUrl = ctx.request.body.mediaUrl || '';
        let introductionTitle = ctx.request.body.introductionTitle || '';
        let introduction = ctx.request.body.introduction || '';
        let bookId = ctx.request.body.bookId || '';
        let url = ctx.request.body.url || '';
        let imageCenter = ctx.request.body.imageCenter || '';
        let summary = ctx.request.body.summary || '';
        if (!password || password !== 'yaodengke') {
            throw new APIError("not_login", "密码为空或密码错误");
        }

        let result = await tableArticles.create({
            type: type,
            title: title,
            mediaType: mediaType,
            mediaUrl: mediaUrl,
            introductionTitle: introductionTitle,
            introduction: introduction,
            bookId: bookId,
            url: url,
            imageCenter: imageCenter,
            summary: summary,
        });
        if(result) {
            ctx.rest("保存成功");
        } else {
            throw new APIError("error", "保存失败");
        }
    },
};
