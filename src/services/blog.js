/** 
 * blog servers
 */
const {
    Blog,
    User
} = require('../db/model/index');
const {
    formatUser
} = require('./_format')


//创建微博
async function createBlog({
    userId,
    content,
    image
}) {
    const result = await Blog.create({
        userId,
        content,
        image
    })
    return result.dataValues;
}

//根据用户获取微博列表
async function getBlogListByUser({
    userName,
    pageIndex = 0,
    pageSize = 10
}) {
    //拼接查询条件
    const userWhereOpts = {}
    if (userName) {
        userWhereOpts.userName = userName
    }

    //查询
    const result = await Blog.findAndCountAll({
        limit: pageSize,
        offset: pageSize * pageIndex, //跳过多少页
        order: [
            ['id', 'desc'] //根据id倒序查询
        ],
        include: [ //连表查询
            {
                model: User,
                attributes: ['userName', 'nickName', ], //需要的信息 
                where: userWhereOpts
            }
        ]
    })

    //result.count 总数，跟分页无关
    //result.rows  查询结果，数组

    let blogList = result.rows.map(row => row.dataValues);

    blogList = blogList.map(blogItem => {
        const user = blogItem.user.dataValues
        blogItem.user = formatUser(user);
        return blogItem
    })

    return {
        count: result.count,
        list
    }

}


module.exports = {
    createBlog,
    getBlogListByUser
}