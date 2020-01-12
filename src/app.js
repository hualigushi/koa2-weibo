const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const session = require('koa-generic-session')
const redisStore = require('koa-redis')

const { REDIS_CONF } = require('./conf/db')
const { isProd } = require('./utils/env')
const {
    SESSION_SECRET_KEY
} = require('./conf/secretKeys')

const squareAPIRouter = require('./routes/api/blog-square')
const profileAPIRouter = require('./routes/api/blog-profile')
const blogHomeAPIRouter = require('./routes/api/blog-home')
const blogViewRouter = require('./routes/view/blog')
const utilsAPIRouter = require('./routes/api/utils')
const userViewRouter = require('./routes/view/user')
const userAPIRouter = require('./routes/api/user')
const errorViewRouter = require('./routes/view/error')

// error handler
const onerrorConf = {}
if (isProd) {
    onerrorConf = {
        redirect: '/error'
    }
}
onerror(app, onerrorConf) // 发生错误时，直接跳转到错误页

// middlewares
app.use(bodyparser({
    enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
    extension: 'ejs'
}))

// session 配置
app.keys = [SESSION_SECRET_KEY]
app.use(session({
    key: 'weibo.sid', // cookie name,默认是koa.sid
    prefix: 'weibo:sess:', // redis key的前缀，默认是  koa:sess:
    cookie: {
        path: '/',
        httpOnly: true, // cookie 只能服务端修改，客户端无权修改
        maxAge: 24 * 60 * 60 *1000 // ms
    },
    store: redisStore({
        all: `${REDIS_CONF.host}:${REDIS_CONF.port}`
    })
}))

// logger
// app.use(async (ctx, next) => {
//   const start = new Date()
//   await next()
//   const ms = new Date() - start
//   console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
// })

// routes
app.use(squareAPIRouter.routes(), squareAPIRouter.allowedMethods())
app.use(profileAPIRouter.routes(), profileAPIRouter.allowedMethods())
app.use(blogHomeAPIRouter.routes(), blogHomeAPIRouter.allowedMethods())
app.use(blogViewRouter.routes(), blogViewRouter.allowedMethods())
app.use(utilsAPIRouter.routes(), utilsAPIRouter.allowedMethods())
app.use(userViewRouter.routes(), userViewRouter.allowedMethods())
app.use(userAPIRouter.routes(), userAPIRouter.allowedMethods())
app.use(errorViewRouter.routes(),errorViewRouter.allowedMethods())//404需要放到最后

// error-handling
app.on('error', (err, ctx) => {
    console.error('server error', err, ctx)
})

module.exports = app
