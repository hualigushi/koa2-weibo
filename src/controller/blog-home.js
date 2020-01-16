/**
 * @description 首页 
 * @author
 */

const {createBlog,getFollowersBlogList}=require('../services/blog')
const {SuccessModel,ErrorModel}=require('../model/ResModel')
const { PAGE_SIZE, REG_FOR_AT_WHO } = require('../conf/constants')
const {createBlogFailInfo}=require('../model/ErrorInfo')
const xss=require('xss')

/**
 * 创建微博
 * @param {Object} param0 创建微博所需的数据 {userId,content,image}
 */ 
async function create({userId,content,image}){
    // 创建要try-catch
    try {
        //创建微博
        const blog=await createBlog({
            userId,
            content: xss(content),
            image
        })
        return new SuccessModel(blog)
    } catch (error) {
        console.error(error.message,ex.stack)
        return new ErrorModel(createBlogFailInfo)
    }

}

/**
 * 获取首页微博列表
 * @param {number} userId userId
 * @param {number} pageIndex page index
 */
async function getHomeBlogList(userId, pageIndex = 0) {
    const result = await getFollowersBlogList(
        {
            userId,
            pageIndex,
            pageSize: PAGE_SIZE
        }
    )
    const { count, blogList } = result

    // 返回
    return new SuccessModel({
        isEmpty: blogList.length === 0,
        blogList,
        pageSize: PAGE_SIZE,
        pageIndex,
        count
    })
}


module.exports={
    create,
    getHomeBlogList
}
