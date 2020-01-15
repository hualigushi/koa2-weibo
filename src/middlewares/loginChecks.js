/** 
 * 登录验证 中间件
 */

const {
    ErrorModel
} = require('../model/ResModel');
const {
    loginCheckFailInfo
} = require('../model/ErrorInfo');


//服务端调接口时验证是否登录（如token过期等等）
async function loginCheck(ctx, next) {
    if (ctx.session && ctx.session.userInfo) {
        //已登录
        await next()
        return;
    }

    //未登录
    ctx.body = new ErrorModel(loginCheckFailInfo);
}


//针对页面的
async function loginRedirect(ctx, next) {
    if (ctx.session && ctx.session.userInfo) {
        //已登录
        await next()
        return;
    }

    //未登录
    const curUrl = ctx.url;
    ctx.redirect('/login?url=' + encodeURIComponent(curUrl))
}

module.exports = {
    loginCheck,
    loginRedirect
}
