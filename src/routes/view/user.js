/**
 * @description 页面登录注册
 * @author money
 */

const router  = require('koa-router')()
const {loginRedict} = require('../../middlewares/routeCkeck')

router.get('/login',async (ctx,next)=>{
    await ctx.render('login',{})
})

router.get('/register',async (ctx,next)=>{
    await ctx.render('register',{})
})
router.get('/setting',loginRedict,async(ctx,next)=>{
    await ctx.render('setting',ctx.session.userInfo)
})

module.exports=router