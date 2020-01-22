## 开发环境
1. 修改 `src/db/sync.js` 中mysql数据库的ip和密码
2. 运行 `node src/db/sync.js`, 新建数据库表
3. 启动redis
4. 启动mysql数据库
5. `npm run dev` 启动
6. 浏览器打开 `localhost:3000`

## 测试
1. 开发环境下新建zhangsan  lisi用户
2. network中复制cookie到test/testUserInfo.js
3. npm run test

## pm2
1. npm run prd
2. pm2 restart 0
3. pm2 stop 0
4. pm2 delete 0
5. pm2 log
6. pm2 monitor
7. pm2配置
```
pm2.config.json

{
    "apps": {
        "name": "weibo",
        "script": "bin/www",
        "watch": true,
        "ignore_watch": [
            "node_modules",
            "logs",
            "uploadFiles"
        ],
        "instances": 4,
        "error_file": "./logs/err.log",
        "out_file": "./logs/out.log",
        "log_date_format": "YYYY-MM-DD HH:mm:ss"
    }
}

"prd": "cross-env NODE_ENV=production pm2 start pm2.config.json"
```

## 知识点
1. 前端页面使用ejs后端模板引擎
2. 缓存数据库使用 redis
3. 单元测试使用 jest

   文件名为： *.test.js

   --runInBand 一个一个测试执行，--forceExit 测试完退出,--colors 测试代码高亮

   ```"test": "cross-env NODE_ENV=test jest --runInBand --forceExit --colors"```
4. 使用 koa-generator 生成脚手架
5. 安装cross-env 区分开发和生产环境
```
"dev": "cross-env NODE_ENV=dev ./node_modules/.bin/nodemon --inspect=9229 bin/www",
"prd": "cross-env NODE_ENV=production pm2 start bin/www",
```
6. 项目启动文件为`bin/www`,不包含任何业务，而`src/app.js`中包含业务
7. 安装myq2 sequelize, 使用ORM操作mysql
8. jsdoc 注释
9. 安装koa-generic-session和 koa-redis 操作session和redis
10. 测试http请求，使用supertest
11. 安装eslint 和 babel-eslint 做代码检查
```
.eslintignore
node_modules
test
src/public
```

```
.eslintrc.json
{
    "parser": "babel-eslint",
    "env": {
        "es6": true,
        "commonjs": true,
        "node": true
    },
    "rules": {
        "indent": [
            "error",
            4
        ],
        "quotes": [
            "error",
            "single",
            {
                "allowTemplateLiterals": true
            }
        ],
        "semi": [
            "error",
            "never"
        ]
    }
}
```

```
package.json

"lint": "eslint --ext .js ./src"
```

12. 安装pre-commit 可以指定代码提交前执行lint,强制代码规范检查
```
package.json

"pre-commit": [
    "lint"
  ]
```

13. 添加--inspect 可以启动chrome调试模式(chrome://inspect)，通过debugger来更好的找出问题,端口默认是9229

```
package.json

"dev": "cross-env NODE_ENV=dev ./node_modules/.bin/nodemon --inspect=9229 bin/www"
```

14. jwt vs session

jwt (json web token) 用户认证成功后，server端返回一个加密的token给客户端，存储在客户端，不存储在服务器端，

客户端后续每次请求都带token ,以示当前的用户身份，

不依赖cookie，可以存在header中，在跨域复杂的情况下，方便

jwt更适合于服务节点较多，蛞蝓比较多的系统

session 存储在服务端，依赖cookie，默认不可跨域

session更适合于统一的web服务，server要严格管理用户信息
```
// app.js
const jwtKoa = require('koa-jwt')

app.use(jwtKoa({
  secret: SECRET
}).unless({
  path: [/^\/users\/login/] // 忽略验证目录
}))
```

```
const jwt = require('jsonwebtoken')
const util = require('util')
const verify = util.promisify(jwt.verify)
const { SECRET } = require('../config/constants')

router.post('/login', async (ctx, next) => {
  const { userName, password } = ctx.request.body
  let userInfo
  if (userName === 'zhangsan' && password === '123') {
    userInfo = {
      userId: 1,
      userName: 'zhangsan',
      nickName: '张三',
      gender: 1
    }
  }
  // 加密  userInfo
  let token
  if (userInfo) {
    token = jwt.sign(userInfo, SECRET, { expiresIn: '1h' })
  }

  if (userInfo === undefined) {
    ctx.body = {
      error: -1,
      msg: '登录失败'
    }
    return
  }
  ctx.body = {
    error: 0,
    data: token
  }
})

router.get('/getUserInfo', async (ctx, next) => {
  const token = ctx.header.authorization
  try {
    const payload = await verify(token.split(' ')[1], SECRET)
    ctx.body = {
      errno: 0,
      userInfo: payload
    }
  } catch (e) {
    ctx.body = {
      errno: -1,
      msg: 'verify token failed'
    }
  }
})
```

15. 安装ajv 做数据格式校验

```
/** 
 * json schme 校验
 */

const Ajv = require('ajv')

const ajv = new Ajv({
    // allErrors: true //输出所有的错误
})

/** 
 * json schema 校验
 * @param { Object} schema json schema规则
 * @param { Object } data 待校验的数据
 */
function validate(schema, data = {}) {
    const valid = ajv.validate(schema, data)
    if (!valid) {
        return ajv.errors[0]
    }
}

module.exports = validate
```

```
const validate = require('./_validate')

// 校验规则
const SCHEMA = {
    type: 'object',
    properties: {
        content: {
            type: 'string'
        },
        image: {
            type: 'string',
            maxLength: 255
        }
    }
}

/**
 * 校验微博数据格式
 * @param {Object} data 微博数据
 */
function blogValidate(data = {}) {
    return validate(SCHEMA, data)
}

module.exports = blogValidate
```

16. 安装formidable-upload-koa 做文件上传

17. 安装 fs-extra 做文件操作，fs-extra依赖于原生fs,做了promise 扩展
```
const path = require('path')
const fse = require('fs-extra')

//存储目录
const DIST_FOLDER_PATH = path.join(__dirname, '..', '..', 'uploadFiles')

const MIX_SIZE = 1024 * 1024 * 1024 //文件最大体积 1M

//是否需要创建目录
fse.pathExists(DIST_FOLDER_PATH).then(exist => {
    if (!exist) {
        fse.ensureDir(DIST_FOLDER_PATH)
    }
})

/**
 * 保存文件
 * @param {string} name 文件名 
 * @param {string} type 文件类型
 * @param {number} size 文件体积 
 * @param {string} filePath 文件路径
 */  
async function saveFile({
    name,
    type,
    size,
    filePath
}) {
    if (size > MIX_SIZE) {
        await fse.remove(filePath)
        return new ErrorModel(uploadFileSizeFailInfo)
    }

    //移动文件
    const fileName = Date.now() + '.' + name //防止重名
    const distFilePath = path.join(DIST_FOLDER_PATH, fileName) //目的地
    await fse.move(filePath, distFilePath)

    //返回信息   
    return new SuccessModel({
        url: '/'+ fileName,
    })
}

module.exports = {
    saveFile
}
```

```
const router = require('koa-router')()
const koaFrom = require('formidable-upload-koa')
const {
    saveFile
} = require('../../controller/utils')

router.prefix('/api/utils')

//上传图片
router.post('/upload', koaFrom(), async (ctx, next) => {
    const file = ctx.req.files['file']
    if (!file) {
        return
    }
    const {
        size,
        path,
        name,
        type
    } = file
    ctx.body = await saveFile({
        name,
        type,
        size,
        filePath: path
    })
})

module.exports = router

app.js
app.use(koaStatic(path.join(__dirname, '..', 'uploadFiles')))
```

18. 安装xss 预防xss攻击

19. 安装date-fns 做时间样式处理

```
const {
    format
} = require('date-fns')

/**
 * @description 时间格式化
 * @author money
 * @param {string} str 时间字符串 
 */
function timeFormat(str) {
    return format(new Date(str), 'MM.dd HH:mm')
}
```