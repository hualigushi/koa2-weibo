/** 
 * 微博数据模型
 */

const seq = require('../seq')
const {
    INTEGER,
    STRING,
    TEXT
} = require('../types')

const Blog = seq.define('blog', {
    userId: {
        type: INTEGER,
        allowNumm: false,
        comment: '用户id'
    },
    content: {
        type: TEXT,
        allowNumm: false,
        comment: '微博内容'
    },
    image: {
        type: STRING,
        comment: '图片地址'
    }
})

module.exports = Blog