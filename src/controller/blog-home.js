/**
 * @description blog-home controller
 * @author chengpeng
 */

const xss = require('xss')
const {
    SuccessModel,
    ErrorModel
} = require('../model/ResModel')
const {
    createBlogFailInfo
} = require('../model/ErrorInfo')
const {
    createBlog,
    getFollowersBlogList
} = require('../services/blog')

const {
    PAGE_SIZE,
    REG_FOR_AT_WHO
} = require('../config/constants')

const {
    getUserInfo
} = require('../services/user')
const {
    createAtRelation
} = require('../services/atRelation')

/**
 * @description 创建微博
 * @author chengpeng
 * @param {Object} param0 创建微博参数 { userId, content, image }
 */
async function create({
    userId,
    content,
    image
}) {
    // 分析并收集 content中@的用户
    // content 格式如 ”@张三 - zhangsan 你好 @李四 - lisi“
    const atUserNameList = []
    content = content.replace(REG_FOR_AT_WHO, (matchStr, nickName, userName) => {
        atUserNameList.push(userName)
        return matchStr // 替换不生效 获取userName
    })

    // 根据 @ 用户名获取用户信息 获取用户id
    const atUserList = await Promise.all(
        atUserNameList.map(item => getUserInfo(item))
    )
    const atUserIdList = atUserList.map(item => item.id)

    try {
        // 创建微博
        const data = await createBlog({
            userId,
            content: xss(content),
            image
        })

        // 创建 @ 关系
        await Promise.all(
            atUserIdList.map(item => createAtRelation(data.id, item))
        )

        return new SuccessModel(data)
    } catch (error) {
        console.error(error.message, error.stack);
        return new ErrorModel(createBlogFailInfo)
    }
}

/**
 * @description 获取首页微博
 * @author chengpeng
 * @param {number} userId 
 * @param {number} pageIndex 
 */
async function getHomeList(userId, pageIndex = 0) {
    const result = await getFollowersBlogList({
        userId,
        pageIndex,
        pageSize: PAGE_SIZE
    })
    const {
        count,
        blogList
    } = result

    return new SuccessModel({
        isEmpty: blogList.length === 0,
        blogList,
        pageSize: PAGE_SIZE,
        pageIndex,
        count
    })
}

module.exports = {
    create,
    getHomeList
}
