/**
 * @description 验证是否登录
 * @author money
 */
const { ErrorModel } = require('../model/resModel')
const { isloginInfo } = require('../model/errorInfo')
async function loginCheck(ctx, next) {
    if (ctx.session && ctx.session.userInfo) {
        await next()
        return
    }
    ctx.body = new ErrorModel(isloginInfo)
}

async function loginRedict(ctx, next) {
    if (ctx.session && ctx.session.userInfo) {
        await next()
        return
    }
    const cururl = ctx.url

    ctx.redirect('login?url=' + encodeURIComponent(cururl))
}

module.exports = {
    loginCheck,
    loginRedict
}