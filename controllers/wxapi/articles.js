const articles = require('../../business/articles');

const APIError = require('../../rest').ApiError;

module.exports = {
    'GET /api/public/wx/swipers': async (ctx, next) => {
        ctx.rest({
            pageSize: 20,
            totalPage: 1,
            curPage: 0,
            swipers:[{pic: "http://localhost:3000/static/images/testImages/swiper1.jpg"},
                {pic: "http://localhost:3000/static/images/testImages/swiper2.jpg"},
                {pic: "http://localhost:3000/static/images/testImages/swiper3.jpg"},
                {pic: "http://localhost:3000/static/images/testImages/swiper1.jpg"},
                {pic: "http://localhost:3000/static/images/testImages/swiper2.jpg"}]
        });
    },
    'GET /api/public/wx/items': async (ctx, next) => {
        ctx.rest({
            pageSize: 20,
            totalPage: 1,
            last_id: 0,
            items:[
                {
                    row_id: 1,
                    name: "夕阳无限好",
                    category: "美丽风景",
                    size_label: "158MB",
                    times: "2018-09-02",
                    city: "Beijing",
                    avatar: "http://localhost:3000/static/images/testImages/avatar.png",
                    num_liked: 589,
                    pic: "http://localhost:3000/static/images/testImages/1.png"
                },
                {
                    row_id: 2,
                    name: "夕阳无限好",
                    category: "美丽风景",
                    size_label: "158MB",
                    times: "2018-09-02",
                    city: "Beijing",
                    avatar: "http://localhost:3000/static/images/testImages/avatar.png",
                    num_liked: 589,
                    pic: "http://localhost:3000/static/images/testImages/2.png"
                },
                {
                    row_id: 3,
                    name: "夕阳无限好",
                    category: "美丽风景",
                    size_label: "158MB",
                    times: "2018-09-02",
                    city: "Beijing",
                    avatar: "http://localhost:3000/static/images/testImages/avatar.png",
                    num_liked: 589,
                    pic: "http://localhost:3000/static/images/testImages/3.png"
                },
                {
                    row_id: 4,
                    name: "夕阳无限好",
                    category: "美丽风景",
                    size_label: "158MB",
                    times: "2018-09-02",
                    city: "Beijing",
                    avatar: "http://localhost:3000/static/images/testImages/avatar.png",
                    num_liked: 589,
                    pic: "http://localhost:3000/static/images/testImages/4.png"
                },
                {
                    row_id: 5,
                    name: "夕阳无限好",
                    category: "美丽风景",
                    size_label: "158MB",
                    times: "2018-09-02",
                    city: "Beijing",
                    avatar: "http://localhost:3000/static/images/testImages/avatar.png",
                    num_liked: 589,
                    pic: "http://localhost:3000/static/images/testImages/5.png"
                }
                ]
        });
    }
};
