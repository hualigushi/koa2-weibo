/**
 * @description 页面错误
 * @author money
 */

const router = require('koa-router')()

//error
router.get('/error',async (ctx,next)=>{
    await ctx.render('你的服务器崩溃了')
})

//404
router.get('*',async (ctx,next)=>{
    await ctx.render('请求错误404')
    
})

module.exports =router

